import { Instance, SnapshotOut, types, cast } from "mobx-state-tree";
import { Goal, GoalModel } from "../goal/goal";
import { StGoal } from "../st-goal/st-goal";
import { withEnvironment } from "../extensions/with-environment";

const commonGoals: Goal[] = [{
  id: "0",
  LTgoal: "Adopt a healthier lifestyle",
  STgoals: cast([{ id: "", title: "Cook meals at home", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Exercise 15 minutes", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Go to sleep early", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Wake up early", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Drink more water", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Eat more fruit and vegetables", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Buy whole grain and high protein products", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "I want to look and feel better.",
},
{
  id: "1",
  LTgoal: "Stop procrastinating and be more productive",
  STgoals: cast([{ id: "", title: "Have regularly scheduled work periods", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Take short, regular breaks", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Plan my week ahead of time with an agenda", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Do a small task in the morning", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Tidy my working area", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "I want to get more work done in less time.",
},
{
  id: "2",
  LTgoal: "Save money",
  STgoals: cast([{ id: "", title: "Budget my money for each week", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Reflect on my purchases", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Grocery shop once a week", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "I want to save up for something special!",
},
{
  id: "3",
  LTgoal: "Be more confident",
  STgoals: cast([{ id: "", title: "Smile more often", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Write down what I'm grateful for", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Straighten my back and adjust my posture", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Give a stranger a compliment", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Read a self-help book for 15 minutes", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Practice a new hobby or skill", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "I want to be more self-assured and happier with myself.",
},
{
  id: "4",
  LTgoal: "Feel less lonely by being more social",
  STgoals: cast([{ id: "", title: "Talk to a new person in my environment", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Call a friend or family member for 30 minutes", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Give a stranger a compliment", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Message 3 people and start a conversation", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "I want to feel more connected to the people around me",
},
{
  id: "5",
  LTgoal: "Reduce my anxiety and feel more calm",
  STgoals: cast([{ id: "", title: "Meditate", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Take 6 deep breaths", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Journal", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Write down 3 affirmations", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Drink a warm beverage", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Take a long bath", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Read a self-help book for 15 minutes", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Listen to a calm song", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "I want to be more relaxed in order to think more clearly.",
},
{
  id: "6",
  LTgoal: "Sleep better",
  STgoals: cast([{ id: "", title: "Meditate", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Read a book in dim light", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Journal", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Drink a warm beverage", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Sleep at the same time everyday", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Wake up at the same time everyday", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Listen to calming soundtracks", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "Sleeping well will help me feel recharged and less tired.",
},
{
  id: "7",
  LTgoal: "Learn a new skill",
  STgoals: cast([{ id: "", title: "Practice for 1 hour", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Watch a tutorial", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Test myself once a week", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "Learning a new skill is fun and rewarding!",
},
{
  id: "8",
  LTgoal: "Get a job",
  STgoals: cast([{ id: "", title: "Review my resume", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Browse job boards", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Review my Linkedin profile", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Review my cover letter", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Practice for interviews", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Apply for 3 jobs", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Reach out to someone and network", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "Job hunting can be very difficult .. ",
},
{
  id: "9",
  LTgoal: "Meet new people",
  STgoals: cast([{ id: "", title: "Attend a local event", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Look into clubs to join", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Start a conversation with a new person", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "I want to expand my social network!",
},
{
  id: "10",
  LTgoal: "Read more books",
  STgoals: cast([{ id: "", title: "Go to the library or bookstore", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Find new books to read", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Read for 30 minutes", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Reflect on my readings", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "Reading will allow me to be more mindful and intelligent.",
},
{
  id: "11",
  LTgoal: "Give back to my community",
  STgoals: cast([{ id: "", title: "Donate to charity", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Look into volunteering opportunities", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Volunteer!", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Help out a friend or neighbor", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Assemble care packages with nessecities for those in need", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Do a clothing drive", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "Helping others helps me feel fulfilled.",
},
{
  id: "12",
  LTgoal: "Be stronger by building muscle",
  STgoals: cast([{ id: "", title: "Sleep more", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Drink a protein shake", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Prepare meals for my week", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Break day", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Go to the gym to lift weights", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "Being toned and muscular will improve my self-confidence",
},
{
  id: "13",
  LTgoal: "Practice mindfulness",
  STgoals: cast([{ id: "", title: "Meditate", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Take deep breaths", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Notice 3 things about the present moment", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Journal about my day", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Take a 30 minute walk", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Work on an art project", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "Focusing on the present will bring me inner peace.",
},
{
  id: "14",
  LTgoal: "Take good care of myself",
  STgoals: cast([{ id: "", title: "Check in with myself", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Take deep breaths", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Journal", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Take a 30 minute walk", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Do a face mask", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Relax by a scented candle", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Take a break and do a relaxing activity", mon: [100], tue: [30], wed: [4] },
    { id: "", title: "Read a self-help book for 15 minutes", mon: [100], tue: [30], wed: [4] },
  ]),
  description: "Self-care will improve my mental health.",
},
];
/**
 * Model description here for TypeScript hints.
 */
export const GoalsStoreModel = types
  .model("GoalsStore")
  .props({
    goals: types.optional(types.array(GoalModel), []),
    STsuggestion: "",
    listOfGoals: types.optional(types.array(GoalModel), commonGoals)
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setLTgoals: (LTgoalsList) => {
      if (LTgoalsList) {
        __DEV__ && console.log("Setting LTgoals list " + LTgoalsList.toString());
        self.goals = LTgoalsList;
      } else { __DEV__ && console.log("Unsetting LTgoals list"); }
    },
    setSuggestion: (suggestion) => {
      if (suggestion) {
        __DEV__ && console.log("Setting suggestion list " + suggestion);
        self.STsuggestion = suggestion;
      } else { __DEV__ && console.log("Unsetting suggestion"); self.STsuggestion = ""; }
    },
    clear: () => {
      self.goals.clear();
    }
  })).actions(self => ({
    getAllGoals: () => {
      return self.environment.api.getAllGoals().then(res => {
        if (res.kind === "ok") {
          self.setLTgoals(res.LTgoals);
          __DEV__ && console.log("Got list of LT goals");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
    postLTgoal: (LTgoal: string, description: string, STgoals: Array<StGoal>) => {
      return self.environment.api.postLTgoal(LTgoal, description, STgoals).then(res => {
        if (res.kind === "ok") {
          __DEV__ && console.log("Added goal to database");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
    putLTgoal: (LTgoal: string, goalID: string, description: string, STgoals: Array<StGoal>) => {
      return self.environment.api.putLTgoal(LTgoal, description, STgoals, goalID).then(res => {
        if (res.kind === "ok") {
          __DEV__ && console.log("Edited goal in database");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
    deleteLTgoal: (goalID: string) => {
      return self.environment.api.deleteLTgoal(goalID).then(res => {
        if (res.kind === "ok") {
          __DEV__ && console.log("Deleted goal from database");
        } else {
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
    getSTsuggestion: (title: string) => {
      return self.environment.api.getSTsuggestion(title).then(res => {
        if (res.kind === "ok") {
          // self.STsuggestion = res.suggestion;
          self.setSuggestion(res.suggestion);
          __DEV__ && console.log("Got ST goal suggestion");
        } else {
          self.setSuggestion(null);
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        self.setSuggestion(null);
        __DEV__ && console.error(err);
      });
    },

    // getOneLTgoal: (goal_id: string) => {
    //   // self.environment.api.getOneLTgoal(goal_id).then(res => {
    //   //   if (res.kind == "ok"){
    //   //     // how to display?
    //   //     __DEV__ && console.log("Got one LT goal")
    //   //   } else {
    //   //     __DEV__ && console.log(res.kind);
    //   //   }
    //   // }).catch(err => {
    //   //   __DEV__ && console.error(err);
    //   // })
    //   return self.goals.filter(goal => {
    //     return goal.id == goal_id
    //   })[0]
    // }
  })); // eslint-disable-line @typescript-eslint/no-unused-vars

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type GoalsStoreType = Instance<typeof GoalsStoreModel>
export interface GoalsStore extends GoalsStoreType {}
type GoalsStoreSnapshotType = SnapshotOut<typeof GoalsStoreModel>
export interface GoalsStoreSnapshot extends GoalsStoreSnapshotType {}
