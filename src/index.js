import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, button, p, h1, h2, input } = hh(h);

const btnStyle = "inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline";
const btnRoundLayout = "text-white font-bold py-1 px-1 rounded";

const MESSAGES = {
  INPUT_LOCATION: "INPUT_LOCATION",
  SAVE_INPUT: "SAVE_INPUT",
  INPUT_ANSWER: "INPUT_ANSWER",
  DELETE_ENTRY: "DELETE_ENTRY",
  UPDATE_ENTRY: "UPDATE_ENTRY",
  SHOW_ANSWER: "SHOW_ANSWER",
  RANK_BAD: "RANK_BAD",
  RANK_GOOD: "RANK_GOOD",
  RANK_GREAT: "RANK_GREAT",
};

function deleteEntries(dispatch, entryId) {
  return () => {
    dispatch({ type: MESSAGES.DELETE_ENTRY, id: entryId });
  };
}

function showEntries(dispatch, entryId) {
  return () => {
    dispatch({ type: MESSAGES.SHOW_ANSWER, id: entryId });
  };
}

function rankBadEntries(dispatch, entryId) {
  return () => {
    dispatch({ type: MESSAGES.RANK_BAD, id: entryId });
  };
}

function rankGoodEntries(dispatch, entryId) {
  return () => {
    dispatch({ type: MESSAGES.RANK_GOOD, id: entryId });
  };
}

function rankGreatEntries(dispatch, entryId) {
  return () => {
    dispatch({ type: MESSAGES.RANK_GREAT, id: entryId });
  };
}

function updateEntries(dispatch, entryId) {
  return () => {
    dispatch({ type: MESSAGES.UPDATE_ENTRY, id: entryId });
  };
}

function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 " }, [
    h1({ className: "text-2xl" }, `Projekt Modul 323`),
    div({ className: "flex gap-2" }, [
      div({ className: "flex gap-2" }, [
        input({ className: "shadow border-zinc-800", value: model.nameQuestion, placeholder: "Enter Question...", oninput: (event) => dispatch(generateMessage(MESSAGES.INPUT_LOCATION, event.target.value)) }, ),
        input({ className: "shadow border-zinc-800", value: model.answer, placeholder: "Enter Answer...", oninput: (event) => dispatch(generateMessage(MESSAGES.INPUT_ANSWER, event.target.value)) }, ),
        button({ className: btnStyle, onclick: () => dispatch(generateMessage(MESSAGES.SAVE_INPUT)) }, "Add"),
      ]),
    ]),
    div({ className: "min-w-full divide-y" }, [
      ...model.entries.map((entry) =>
        div({ className: "bg-amber-500 inline-block w-72 h-72" }, [
          h2({ className: "text-base" }, `Card ${entry.id}`),
          p({ className: "text-xl" }, `Question : ${entry.question}`),
          button(
            { className: "bg-amber-500 hover:bg-amber-600 " + btnRoundLayout, onclick: showEntries(dispatch, entry.id) }, "Flip Card"),
          div({ className: "" }, entry.visibility ? [
            p({ className: "text-xl" }, `Answer : ${entry.answer}`),
            p({ className: "text-base" }, `Rank : ${entry.ranking}`),
            div({ className: "gap-2 flex object-bottom" }, [
              div({ className: "" }, [
                button({ className: "bg-red-700 hover:bg-red-900 " + btnRoundLayout, onclick: deleteEntries(dispatch, entry.id) }, "Delete Entry"),
                button({ className: "bg-blue-700 hover:bg-blue-900 " + btnRoundLayout, onclick: updateEntries(dispatch, entry.id) }, "Edit"),
              ]),
              div({ className: "" }, [
                button({ className: "bg-red-500 hover:bg-red-700 " + btnRoundLayout, onclick: rankBadEntries(dispatch, entry.id) }, "Bad"),
                button({ className: "bg-blue-500 hover:bg-blue-700 " + btnRoundLayout, onclick: rankGoodEntries(dispatch, entry.id) }, "Good"),
                button({ className: "bg-green-500 hover:bg-green-700 " + btnRoundLayout, onclick: rankGreatEntries(dispatch, entry.id) }, "Great"),
              ]),
            ]),
          ] : []),
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

function update(msg, model) {
  console.log(MESSAGES.INPUT_LOCATION);

  switch (msg.type) {
    case MESSAGES.INPUT_LOCATION:
      return { ...model, nameQuestion: msg.data };

    case MESSAGES.INPUT_ANSWER:
      return { ...model, answer: msg.data };

    case MESSAGES.SAVE_INPUT:
      const question = model.nameQuestion;
      const answer = model.answer;
      const id = model.id + 1;
      const entry = { id, question: question, answer: answer, visibility: false, ranking: 0 };
      const entries = [...model.entries, entry];
      model.answer = "";
      model.nameQuestion = "";
      return { ...model, id, entries };

    case MESSAGES.UPDATE_ENTRY:
      let updateEntries = [];
      let updateQuestion = "";
      let updateAnswer = "";

      function updateEntry() {
        return model.entries.map((entry) => {
          if (entry.id === msg.id) {
            return { ...entry, updateQuestion: entry.question, updateAnswer: entry.answer }
          }
          else {
            return { ...entry };
          }
        })
      }

      updateEntries = updateEntry();

      model.nameQuestion = updateQuestion;
      model.answer = updateAnswer;
      return { ...model, nameQuestion: updateQuestion, answer: updateAnswer, entries: updateEntries };

    case MESSAGES.DELETE_ENTRY:
      const deleteEntries = model.entries.filter((entry) => entry.id !== msg.id);
      return { ...model, entries: deleteEntries };

    case MESSAGES.UPDATE_ENTRY:
      return { ...model, editingEntry: msg.entry };

    case MESSAGES.SHOW_ANSWER:
      let showEntries = [];

      function chooseEntry() {
        return model.entries.map((entry) => {
          if (entry.id === msg.id) {
            if (entry.visibility === false) {
              return { ...entry, visibility: true }
            }
            else if (entry.visibility !== false) {
              return { ...entry, visibility: false }
            }
          }
          else {
            return { ...entry };
          }
        })
      }
      showEntries = chooseEntry();
      return { ...model, entries: showEntries }

    case MESSAGES.RANK_BAD:
      let badEntries = [];

      function badEntry() {
        return model.entries.map((entry) => {
          if (entry.id === msg.id) {
            return { ...entry, ranking: 0, visibility: false }
          }
          else {
            return { ...entry };
          }
        })
      }

      badEntries = badEntry();

      badEntries.sort((a, b) => a.ranking - b.ranking);

      return { ...model, entries: badEntries }

    case MESSAGES.RANK_GOOD:
      let goodEntries = [];

      function goodEntry() {
        return model.entries.map((entry) => {
          if (entry.id === msg.id) {
            return { ...entry, ranking: entry.ranking + 1, visibility: false }
          }
          else {
            return { ...entry };
          }
        })
      }

      goodEntries = goodEntry();

      goodEntries.sort((a, b) => a.ranking - b.ranking);

      return { ...model, entries: goodEntries }

    case MESSAGES.RANK_GREAT:
      let greatEntries = [];

      function greatEntry() {
        return model.entries.map((entry) => {
          if (entry.id === msg.id) {
            return { ...entry, ranking: entry.ranking + 2, visibility: false }
          }
          else {
            return { ...entry };
          }
        })
      }

      greatEntries = greatEntry();

      greatEntries.sort((a, b) => a.ranking - b.ranking);

      return { ...model, entries: greatEntries }
  }
}

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const initModel = {
  nameQuestion: "",
  id: 0,
  answer: "",
  answerState: true,
  entries: [],
};

const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);

module.exports = { generateMessage };