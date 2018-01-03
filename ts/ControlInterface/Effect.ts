export default class Effect {

    id: number;
    name: string;
    config: string;
    timeLimit: number|null;
    priority: number|null;
    creationDate: number;

    static fromRow(row: any): Effect{
        const effect = new Effect();
        effect.id = row.id || null;
        effect.name = row.name;
        effect.config = row.config;
        effect.timeLimit = row.timeLimit;
        effect.priority = row.priority;
        effect.creationDate = row.creationDate;
        return effect;
    }

   setName(name){
        this.name = name;
   }
   setConfig(config){
       this.config = config;
   }
   setTimeLimit(timeLimit){
       this.timeLimit = timeLimit;
   }
   setPriority(priority){
       this.priority = priority;
   }
   setCreationDate(creationDate){
       this.creationDate = creationDate;
   }

}