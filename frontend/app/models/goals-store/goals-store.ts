import { Instance, SnapshotOut, types, cast } from "mobx-state-tree";
import { Goal, GoalModel } from "../goal/goal";
import { StGoal } from "../st-goal/st-goal";
import { withEnvironment } from "../extensions/with-environment";

const goalsDatabase: Goal[] = [{
  id: "0",
  LTgoal: "Adopt a healthier lifestyle",
  STgoals: cast([{ id: "", title: "Cook meals at home", mon: [1080], wed: [1080], fri: [1080] },
    { id: "", title: "Exercise 15 minutes", mon: [600], tue: [600], wed: [600] ,thu: [600], fri: [600]},
    { id: "", title: "Go to sleep early", mon: [1320], tue: [1320], wed: [1320], thu:[1320], fri:[1320], sat: [1320], sun: [1320]},
    { id: "", title: "Wake up early", mon: [480], tue: [480], wed: [480], thu:[480], fri:[480], sat: [480], sun: [480] },
    { id: "", title: "Drink more water", mon: [720], tue: [720], wed: [720], thu:[720], fri:[720], sat: [720], sun: [720] },
    { id: "", title: "Eat more fruit and vegetables", tue: [1080], thu: [1080]},
    { id: "", title: "Buy whole grain and high protein products", mon: [900], sun: [900]},
  ]),
  description: "I want to look and feel better.",
},
{
  id: "1",
  LTgoal: "Stop procrastinating and be more productive",
  STgoals: cast([{ id: "", title: "Have regularly scheduled work periods", mon: [540], wed: [540], fri: [540] },
    { id: "", title: "Take short, regular breaks", mon: [720], wed: [720], fri: [720] },
    { id: "", title: "Plan my week ahead of time with an agenda", mon: [510]},
    { id: "", title: "Do a small task in the morning", mon: [510], tue: [510], wed: [510], thu: [510], fri: [510], sat: [510], sun: [510] },
    { id: "", title: "Tidy my working area", sun: [1140] },
  ]),
  description: "I want to get more work done in less time.",
},
{
  id: "2",
  LTgoal: "Save money",
  STgoals: cast([{ id: "", title: "Budget my money for each week", mon: [540] },
    { id: "", title: "Reflect on my purchases", sun: [1200]},
    { id: "", title: "Grocery shop once a week", fri: [960]},
  ]),
  description: "I want to save up for something special!",
},
{
  id: "3",
  LTgoal: "Be more confident",
  STgoals: cast([{ id: "", title: "Smile more often :D", mon: [720], tue: [720], wed: [720], thu:[720], fri:[720], sat: [720], sun: [720] },
    { id: "", title: "Write down what I'm grateful for", mon: [1260], wed: [1260], fri: [1260] },
    { id: "", title: "Do yoga to improve my posture", tue: [960], thu: [960] },
    { id: "", title: "Give a stranger a compliment", mon: [570] },
    { id: "", title: "Read a self-help book for 15 minutes",sun: [1290]},
    { id: "", title: "Practice a new hobby or skill", sat:[810]},
  ]),
  description: "I want to be comfortable in my own skin.",
},
{
  id: "4",
  LTgoal: "Reduce loneliness, socialize more",
  STgoals: cast([{ id: "", title: "Talk to a new person in my environment", mon: [600], wed: [600], fri: [600] },
    { id: "", title: "Call a friend or family member for 30 minutes", tue: [630], thu: [630] },
    { id: "", title: "Give a stranger a compliment", mon: [780]},
    { id: "", title: "Message 3 people and start a conversation", sat: [900]},
  ]),
  description: "I want to feel more connected to the people around me",
},
{
  id: "5",
  LTgoal: "Reduce anxiety and feel calm",
  STgoals: cast([{ id: "", title: "Meditate", mon: [540], wed: [540], fri: [540]},
    { id: "", title: "Take 6 deep breaths", mon: [510,720], tue: [510,720], wed: [510,720], thu:[510,720], fri:[510,720], sat: [510,720], sun: [510,720] },
    { id: "", title: "Journal", sat: [1140] },
    { id: "", title: "Write down 3 affirmations", sun: [1140]},
    { id: "", title: "Drink a warm beverage", tue: [780], thu: [780] },
    { id: "", title: "Take a long bath", sun: [780] },
    { id: "", title: "Read a self-help book for 15 minutes", sun: [1290] },
    { id: "", title: "Listen to a calm song", mon: [1290], wed: [1290], fri: [1290]},
  ]),
  description: "I want to cultivate inner peace.",
},
{
  id: "6",
  LTgoal: "Sleep better",
  STgoals: cast([{ id: "", title: "Meditate", mon: [1260], wed: [1260], fri: [1260]},
    { id: "", title: "Read a book in dim light", tue: [1290], thu: [1290]},
    { id: "", title: "Journal",  sat: [1140]},
    { id: "", title: "Drink a warm beverage", tue: [780], thu: [780]},
    { id: "", title: "Sleep at the same time everyday", mon: [1320], tue: [1320], wed: [1320], thu:[1320], fri:[1320], sat: [1320], sun: [1320]},
    { id: "", title: "Wake up at the same time everyday", mon: [480], tue: [480], wed: [480], thu:[480], fri:[480], sat: [480], sun: [480]},
    { id: "", title: "Listen to calming soundtracks", mon: [1290], wed: [1290], fri: [1290]},
  ]),
  description: "Quality sleep will allow me to recharge.",
},
{
  id: "7",
  LTgoal: "Learn a new skill",
  STgoals: cast([{ id: "", title: "Practice for 1 hour", mon: [780], tue: [780], wed: [780]},
    { id: "", title: "Watch a tutorial", tue: [540], thu: [540] },
    { id: "", title: "Test myself once a week", sat: [1020]},
  ]),
  description: "Learning a new skill is fun and rewarding!",
},
{
  id: "8",
  LTgoal: "Get a job",
  STgoals: cast([{ id: "", title: "Review my resume", mon: [510]},
    { id: "", title: "Browse job boards", sun: [1140]},
    { id: "", title: "Review my Linkedin profile", mon: [570] },
    { id: "", title: "Review my cover letter", tue: [510] },
    { id: "", title: "Practice for interviews", sat: [780] },
    { id: "", title: "Apply for 3 jobs", wed: [540] },
    { id: "", title: "Reach out to someone and network", fri: [840]},
  ]),
  description: "Job hunting can be very difficult .. ",
},
{
  id: "9",
  LTgoal: "Meet new people",
  STgoals: cast([{ id: "" , title: "Attend a local event", sat: [1140] },
    { id: "", title: "Look into clubs to join", mon: [780] },
    { id: "", title: "Start a conversation with a new person", fri: [840] },
  ]),
  description: "I want to expand my social network!",
},
{
  id: "10",
  LTgoal: "Read more books",
  STgoals: cast([{ id: "" , title: "Go to the library or bookstore", sun: [780] },
    { id: "", title: "Find new books to read", sat: [1140] },
    { id: "", title: "Read for 30 minutes", mon: [1260], wed: [1260], fri: [1260]},
    { id: "", title: "Reflect on my readings", sun: [1260] },
  ]),
  description: "Reading will allow me to be more mindful and intelligent.",
},
{
  id: "11",
  LTgoal: "Give back to my community",
  STgoals: cast([{ id: "" , title: "Donate to charity", sun: [1260]},
    { id: "", title: "Look into volunteering opportunities", sat: [1140]},
    { id: "", title: "Volunteer!", sat: [540]},
    { id: "", title: "Help out a friend or neighbor", sun: [540]},
    { id: "", title: "Assemble care packages with nessecities for those in need", thu: [1140]},
    { id: "", title: "Do a clothing drive", wed: [1140]},
  ]),
  description: "Helping others helps me feel fulfilled.",
},
{
  id: "12",
  LTgoal: "Be stronger by building muscle",
  STgoals: cast([{ id: "", title: "Sleep more", mon: [1320], tue: [1320], wed: [1320], thu:[1320], fri:[1320], sat: [1320], sun: [1320]},
    { id: "", title: "Drink a protein shake", mon: [540], wed: [540], fri: [540]},
    { id: "", title: "Prepare meals for my week", sun: [1140]},
    { id: "", title: "Break day", sun: [540]},
    { id: "", title: "Go to the gym to lift weights", mon: [780], wed: [780], fri: [780]},
  ]),
  description: "Working out is fun and rewarding",
},
{
  id: "13",
  LTgoal: "Practice mindfulness",
  STgoals: cast([{ id: "", title: "Meditate", mon: [1260], wed: [1260], fri: [1260]},
    { id: "", title: "Take deep breaths", mon: [510,720], tue: [510,720], wed: [510,720], thu:[510,720], fri:[510,720], sat: [510,720], sun: [510,720]},
    { id: "", title: "Notice 3 things about the present moment", mon: [610,820], tue: [610,820], wed: [610,820], thu:[610,820], fri:[610,820], sat: [610,820], sun: [610,820]},
    { id: "", title: "Journal about my day",mon: [1320], tue: [1320], wed: [1320], thu:[1320], fri:[1320], sat: [1320], sun: [1320]},
    { id: "", title: "Take a 30 minute walk", tue: [540], thu: [540]},
    { id: "", title: "Work on an art project", sat: [1140]},
  ]),
  description: "Focusing on the present will bring me inner peace.",
},
{
  id: "14",
  LTgoal: "Take good care of myself",
  STgoals: cast([{ id: "", title: "Check in with myself", mon: [540], tue: [540], wed: [540], thu:[540], fri:[540], sat: [540], sun: [540]},
    { id: "", title: "Take deep breaths", mon: [510,720], tue: [510,720], wed: [510,720], thu:[510,720], fri:[510,720], sat: [510,720], sun: [510,720]},
    { id: "", title: "Journal", sat: [1140]},
    { id: "", title: "Take a 30 minute walk", tue: [540], thu: [540]},
    { id: "", title: "Do a face mask", sat: [1140]},
    { id: "", title: "Relax by a scented candle", sun: [1140]},
    { id: "", title: "Take a break and do a relaxing activity", sun: [1140]},
    { id: "", title: "Read a self-help book for 15 minutes", sun: [1290]},
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
    getCommonGoals: () => {
      return goalsDatabase 
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
          __DEV__ && console.log(res.kind);
        }
      }).catch(err => {
        __DEV__ && console.error(err);
      });
    },
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
