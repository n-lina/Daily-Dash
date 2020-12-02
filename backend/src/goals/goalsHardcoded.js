const logger = require("../logger/logging");
const GoalModel = require("../models/goals");

let LTG1 = {"userId":"testUser1","title":"Run a marathon in 2 years",
    "description":"irrelevant words",
    "shortTermGoals":[{"title":"Run for 30 minutes every weekday evening.","mon":[5,15],"wed":[30,20]},
        {"title":"Run for 2 hours every weekend day.","sat":[5,15],"sun":[30,20]},
        {"title":"Go to yoga class once a week.","mon":[5,15],"wed":[30,20]}
    ]
}

let LTG2 = {"userId":"testUser2","title":"Play guitar like Jimmy Hendrix within a few years.",
    "description":"irrelevant words",
    "shortTermGoals":[{"title":"Work at the pitch and putt to save up for an electric guitar.","mon":[15,25],"wed":[30,20]},
        {"title":"Practice playing on mom's acoustic guitar until you get the electric guitar.","sat":[5,15],"sun":[30,20]},
        {"title":"Do finger training with the finger pump machine thingy.","mon":[5,15],"wed":[30,20]}
    ]
}

let LTG3 = {"userId":"testUser3","title":"Become a great coder within 6 months.",
    "description":"irrelevant words",
    "shortTermGoals":[{"title":"Do a coding challenge practice problem each weekday.","mon":[5,15],"wed":[30,20]},
        {"title":"Every week, make a project that helps out mom and dad.","sat":[5,15],"sun":[30,20]},
        {"title":"Every Sunday, visit a makerspace and see what people are up to, coding-wise, for inspiration.","mon":[5,15],"wed":[30,20]}
    ]
}

let LTG4 = {"userId":"testUser4","title":"Adopt a healthier lifestyle",
    "description":"I want to look and feel better.",
    "shortTermGoals":[{"title": "Cook meals at home", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Exercise 15 minutes", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Go to sleep early", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Wake up early", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Drink more water", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Eat more fruit and vegetables", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Buy whole grain and high protein products", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG5 = {"userId":"testUser5","title":"Stop procrastinating and be more productive",
    "description":"I want to get more work done in less time.",
    "shortTermGoals":[{"title": "Have regularly scheduled work periods", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Take short, regular breaks", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Plan my week ahead of time with an agenda", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Do a small task in the morning", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Tidy my working area", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG6 = {"userId":"testUser6","title":"Save money",
    "description":"I want to save up for something special!",
    "shortTermGoals":[{"title": "Budget my money for each week", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Reflect on my purchases", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Grocery shop once a week", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG7 = {"userId":"testUser7","title":"Be more confident",
    "description":"I want to be more self-assured and happier with myself.",
    "shortTermGoals":[{"title": "Smile more often", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Write down what I'm grateful for", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Straighten my back and adjust my posture", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Give a stranger a compliment", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Read a self-help book for 15 minutes", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Practice a new hobby or skill", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG8 = {"userId":"testUser8","title":"Feel less lonely by being more social",
    "description":"I want to feel more connected to the people around me",
    "shortTermGoals":[{"title": "Talk to a new person in my environment", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Call a friend or family member for 30 minutes", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Give a stranger a compliment", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Message 3 people and start a conversation", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG9 = {"userId":"testUser9","title":"Reduce my anxiety and feel more calm",
    "description":"I want to be more relaxed in order to think more clearly.",
    "shortTermGoals":[{"title": "Meditate", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Take 6 deep breaths", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Journal", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Write down 3 affirmations", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Drink a warm beverage", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Take a long bath", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Read a self-help book for 15 minutes", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Listen to a calm song", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG10 = {"userId":"testUser10","title":"Sleep better",
    "description":"Sleeping well will help me feel recharged and less tired.",
    "shortTermGoals":[{"title": "Meditate", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Read a book in dim light", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Journal", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Drink a warm beverage", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Sleep at the same time everyday", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Wake up at the same time everyday", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Listen to calming soundtracks", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG11 = {"userId":"testUser11","title":"Learn a new skill",
    "description":"Learning a new skill is fun and rewarding!",
    "shortTermGoals":[{"title": "Practice for 1 hour", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Watch a tutorial", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Test myself once a week", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG12 = {"userId":"testUser12","title":"Get a job",
    "description":"Job hunting can be very difficult .. ",
    "shortTermGoals":[{"title": "Review my resume", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Browse job boards", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Review my Linkedin profile", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Review my cover letter", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Practice for interviews", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Apply for 3 jobs", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Reach out to someone and network", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG13 = {"userId":"testUser13","title":"Meet new people",
    "description":"I want to expand my social network!",
    "shortTermGoals":[{"title": "Attend a local event", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Look into clubs to join", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Start a conversation with a new person", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG14 = {"userId":"testUser14","title":"Read more books",
    "description":"Reading will allow me to be more mindful and intelligent.",
    "shortTermGoals":[{"title": "Go to the library or bookstore", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Find new books to read", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Read for 30 minutes", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Reflect on my readings", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG15 = {"userId":"testUser15","title":"Give back to my community",
    "description":"Helping others helps me feel fulfilled.",
    "shortTermGoals":[{"title": "Donate to charity", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Look into volunteering opportunities", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Volunteer!", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Help out a friend or neighbor", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Assemble care packages with nessecities for those in need", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Do a clothing drive", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG16 = {"userId":"testUser16","title":"Be stronger by building muscle",
    "description":"Being toned and muscular will improve my self-confidence",
    "shortTermGoals":[{"title": "Sleep more", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Drink a protein shake", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Prepare meals for my week", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Break day", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Go to the gym to lift weights", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG17 = {"userId":"testUser17","title":"Practice mindfulness",
    "description":"Focusing on the present will bring me inner peace.",
    "shortTermGoals":[{"title": "Meditate", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Take deep breaths", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Notice 3 things about the present moment", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Journal about my day", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Take a 30 minute walk", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Work on an art project", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let LTG18 = {"userId":"testUser18","title":"Take good care of myself",
    "description":"Self-care will improve my mental health.",
    "shortTermGoals":[{"title": "Check in with myself", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Take deep breaths", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Journal", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Take a 30 minute walk", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Do a face mask", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Relax by a scented candle", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Take a break and do a relaxing activity", "mon": [100], "tue": [30], "wed": [4] },
      {"title": "Read a self-help book for 15 minutes", "mon": [100], "tue": [30], "wed": [4] },
    ]
}

let arrayHCLTGS = [LTG1, LTG2, LTG3, LTG4, LTG5, LTG6, LTG7, LTG8, LTG9, LTG10, LTG11, LTG12, LTG13, LTG14, LTG15, LTG16, LTG17, LTG18];

async function addHardcodedGoal(LTG_) {
    try {
        var result = await GoalModel.find({ userId: LTG_.userId });
      } catch (error) {
        logger.error(error);
      }

    if (result.length===0) {
        try {
            const goalObj = new GoalModel({userId: LTG_.userId, title: LTG_.title, description: LTG_.description, shortTermGoals: LTG_.shortTermGoals });    
            await goalObj.save().then((doc) => {logger.info(doc);}); 
        } catch (error) {
            logger.error(error);
          } 
    }  
}

function addHCGoals() {
    for(let LTG_ of arrayHCLTGS) {
        addHardcodedGoal(LTG_);    
    }
}


module.exports = {addHCGoals};
