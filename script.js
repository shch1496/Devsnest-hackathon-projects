(function(){
    /* model*/
    const notepad = document.querySelector(".notepad")
    const addNote = document.querySelector(".add-note");
    const closeNote = document.querySelector(".close-btn");
    textarea = document.querySelector("#autoresizing");
    const saveNote = document.querySelector(".save-btn")
    const noteTitle = document.querySelector(".note-title");
    const noteBody = document.querySelector(".note-body");
    const container = document.querySelector(".container");
    const templates = document.querySelector("#templates");
    const textBold = document.querySelector(".text-bold"); 
    const textItalic = document.querySelector(".text-italic");
    const textUnderline = document.querySelector(".text-underline");
    const textCopy = document.querySelector(".text-copy");
    const topTitle = document.querySelector(".top-title");
    
    let notes = [];
    // let selectedText = "";
    //Selcetion range
    let range;

    let selectedNoteId, selectedNote;



    const MAX_DECRIPTION_LENGTH = {
           max_desc_length: 70
    }

    Object.freeze(MAX_DECRIPTION_LENGTH);

   
    saveNote.addEventListener("click", handleSaveClick);
    // textBold.addEventListener("click", handleTextBold);
    textBold.addEventListener("click", handleTextBold);
    textItalic.addEventListener("click", handleTextItalic);
    textUnderline.addEventListener("click", handleTextUnderline);
    textCopy.addEventListener("click", handleTextCopy);




    function getSelectedText() {  
      let selection = document.getSelection()
      range = selection.getRangeAt(0);
    }

    noteBody.addEventListener("selectstart", () => {

      document.addEventListener("selectionchange", getSelectedText);
    });


    noteBody.addEventListener("mouseleave", () => {
        document.removeEventListener("selectionchange", getSelectedText);
    })
   

 
    function handleTextBold(){
        const strongElement = document.createElement("strong");
        range.surroundContents(strongElement);
        
    }
        
    

    function handleTextItalic(){
        const italicElement = document.createElement("em");
        range.surroundContents(italicElement);
    }


    function handleTextUnderline(){
        const underlineElement = document.createElement("u");
        range.surroundContents(underlineElement);
    }

    function handleTextCopy(){
  
        var copyText = noteBody.innerText;


        navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
            if (result.state == "granted" || result.state == "prompt") {
                
                navigator.clipboard.writeText(copyText).then(() => {
        
                    alert("Text copied to clipboard");
                });
            }
          });
   
    }
   

  

     
 


    function handleSaveClick(){
        if(notes.length == 0){
            container.innerText = ""
        }

            let max_desc_length = MAX_DECRIPTION_LENGTH.max_desc_length

            let title = noteTitle.value.trim();
            let body = noteBody.innerHTML.trim();
            let bodyText = noteBody.textContent.trim();
            if(!title && !body){
               alert("Write something");
               return
            }
    
    
            if(selectedNoteId && selectedNote){
    
                //Array change
                let note =  notes.find(card => selectedNoteId == card.id);
                note.title = title;
                note.body = body;
    
    
               //DOM change
               let cardTitle = selectedNote.querySelector(".card-title");
                cardTitle.innerText = title;
            
               let cardBody = selectedNote.querySelector(".card-desc");
               
               
               cardBody.innerText = `${bodyText.substring(0, max_desc_length)}
               ${bodyText.length > max_desc_length ? "..." : ""}`
          
               
               selectedNoteId=""
               selectedNote=""
    
    
            }else{
               
                let id = generateUniqueId();
        
                let newNote = {
                   id: id,
                   title: title,
                   body: body
                }
        
                // push new note to the array
                notes.push(newNote);
                
                let cardTemplate = templates.content.querySelector(".card");
                let card = document.importNode(cardTemplate, true);
        
        
                let cardTitle = card.querySelector(".card-title");
                cardTitle.textContent = title;
            
                let cardBody = card.querySelector(".card-desc");
        
        
               
                cardBody.textContent = `${bodyText.substring(0, max_desc_length)}
                    ${bodyText.length > max_desc_length ? "..." : ""}
                `
               
                card.setAttribute("data-card-id", id);
                
              
                container.append(card);
        
                card.addEventListener("click", handleCardClick)
                
        }


        closeNote.dispatchEvent(new Event("click")); 
        noteBody.innerText = ""
        noteTitle.value = ""
    
        

   }


    function generateUniqueId(){
        let uniqueId = Math.floor(Math.random()*1000000);
        return uniqueId;
     }





  function handleCardClick() {
 
    let cardId = this.dataset.cardId;
    let note=  notes.find(card => cardId == card.id);
     
    let title = note.title;
    let body = note.body;

    noteTitle.value = title
    noteBody.innerHTML = body;
    selectedNoteId = cardId;
    selectedNote = this;
    topTitle.innerText = title;
    notepad.showModal();
   
   
  }


   

    
    addNote.addEventListener("click", function(){
        noteBody.innerText = ""
        noteTitle.value = ""
        topTitle.innerHTML = "Untitled"
        notepad.showModal();
    
    
    })
    
    
    
    closeNote.addEventListener("click", function(){
        notepad.close();
    
    })



    //Placeholder for contentEditable div

    const ele = document.getElementById('note-body');

    // Get the placeholder attribute
    const placeholder = ele.getAttribute('data-placeholder');

    // Set the placeholder as initial content if it's empty
    ele.innerHTML === '' && (ele.innerHTML = placeholder);

    ele.addEventListener('focus', function (e) {
        const value = e.target.innerHTML;
        value === placeholder && (e.target.innerHTML = '');
    });

    ele.addEventListener('blur', function (e) {
        const value = e.target.innerHTML;
        value === '' && (e.target.innerHTML = placeholder);
    });

   


   

})();
