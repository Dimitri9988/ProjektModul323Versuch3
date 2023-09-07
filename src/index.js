import hh from "hyperscript-helpers";
import { test } from "ramda";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";


// allows using html tags as functions in javascript wsws
//dewnn
const { div, button, p, h1, h2, input } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline";
const btnRoundlayout = " text-white font-bold py-1 px-1 rounded";

// Messages which can be used to update the model
const MSGS = {
  INPUT_LOCATION: "INPUT_LOCATION",
  SAVE_INPUT: "SAVE_INPUT",
  INPUT_AWNSER: "INPUT_AWNSER",
  DELETE_ENTRY: "DELETE_ENTRY",
  UPDATE_ENTRY: "UPDATE_ENTRY",
  SHOW_AWNSER: "SHOW_AWNSER", 
};




function deleteEntries(dispatch, entryId) {
  
  return () => {
    dispatch({ type: MSGS.DELETE_ENTRY, id: entryId });
  };
  
}

function showEntries(dispatch, entryId) {
  
  return () => {
    dispatch({ type: MSGS.SHOW_AWNSER, id: entryId });
  };
  
}








// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  console.log(model.entries);

  return div({ className: "flex flex-col gap-4 " }, [
    h1({ className: "text-2xl" }, `Projekt Modul 323`),
    div({className: "flex gap-2"}, [
      div({className: "flex gap-2"}, [
        input({ className: "shadow border-zinc-800", placeholder: "Enter Question...", oninput: (event) => dispatch(generateMessage(MSGS.INPUT_LOCATION, event.target.value)) }, ),
        input({ className: "shadow border-zinc-800", placeholder: "Enter Anwser...", oninput: (event) => dispatch(generateMessage(MSGS.INPUT_AWNSER, event.target.value)) }, ),
        button({ className: btnStyle, onclick: () => dispatch(generateMessage(MSGS.SAVE_INPUT))}, "Add"),
      ]),
    ]),
    
    
    
    
    div({ className: "min-w-full divide-y" }, [
      ...model.entries.map((entry) =>
        div({ className: "bg-amber-500 inline-block w-72 h-72" }, [
          h2({ className: "text-xl" }, `Card ${entry.id}`),
          p({ className: "" }, `Question : ${entry.question}`),
          button(
            { className: "bg-amber-500 hover:bg-amber-600 " + btnRoundlayout, onclick: showEntries(dispatch, entry.id) },"Flip Card"),
          
          
          div({className: ""}, entry.visibility ? [
            p({ className: "" }, `Awnser : ${entry.awnser}`),
            // Button zum Löschen eines Eintrags
          
            div({ className: "gap-2 flex object-bottom"}, [
              div({ className: " "} , [
                button({ className: "bg-red-700 hover:bg-red-900 " + btnRoundlayout, onclick: deleteEntries(dispatch, entry.id) }, "Delete Entry"),
                button({ className: "bg-blue-700 hover:bg-blue-900 " + btnRoundlayout, onclick: () => dispatch(updateEntry(dispatch, entry.id)) },"Edit"),
              ]),
              div({ className: " "} , [
                button({ className: "bg-red-500 hover:bg-red-700 " + btnRoundlayout, onclick: deleteEntries(dispatch, entry.id) }, "Bad"),
                button({ className: "bg-blue-500 hover:bg-blue-700 " + btnRoundlayout, onclick: deleteEntries(dispatch, entry.id) }, "Good"),
                button({ className: "bg-green-500 hover:bg-green-700 " + btnRoundlayout, onclick: deleteEntries(dispatch, entry.id) }, "Great"),
              ]),
            ]),
          ] : [] ),

        
        
        ]),
        

      ),
    ]),
  ]);
}



const generateMessage = (msg, data) => {
  
  return {
    type: msg,
    data,
    
  };
  
};



// Update function which takes a message and a model and returns a new/updated model

function update(msg, model) {
  console.log(msg.id);
  

  switch (msg.type) {
    case MSGS.INPUT_LOCATION:
      return { ...model, nameQuestion: msg.data };
    
    case MSGS.INPUT_AWNSER:
      return { ...model, awnser: msg.data };

      case MSGS.SAVE_INPUT:
        const question = model.nameQuestion;
        const awnser = model.awnser;
        const id = model.id + 1; // Erhöhe die ID für den neuen Eintrag
        const entry = { id, question: question, awnser: awnser, visibility: false, ranking: 0};
        const entries = [...model.entries, entry];
        model.nameLocation = "";
      return { ...model, id, entries };

      case MSGS.DELETE_ENTRY:
        const deleteEntries = model.entries.filter((entry) => entry.id !== msg.id);
      return { ...model, entries: deleteEntries };

      case MSGS.UPDATE_ENTRY:
      // Setzen des editingEntry-Feldes auf den ausgewählten Eintrag
      return { ...model, editingEntry: msg.entry };


      case MSGS.SHOW_AWNSER:
      let showEntries = [];
      
      function chooseEntry() {
        return model.entries.map((entry)  => {
          if (entry.id === msg.id) {
            if (entry.visibility === false) {
              return {...entry, visibility: true}
            }
            else if (entry.visibility !== false) {
              return {...entry, visibility: false}
            } 
          }
          else {
            return {...entry};
          }
        })
        }
        showEntries = chooseEntry();
      
      return { ...model, entries: showEntries}

  }

};





// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  async function dispatch(msg) {
    model = await update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
    

  }
}



// The initial model when the app starts
const initModel = {
  nameQuestion: "",
  id : 0,
  awnser: "",
  awnserState: true,
  entries: [],
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);













