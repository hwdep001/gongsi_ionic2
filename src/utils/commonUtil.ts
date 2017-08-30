export class CommonUtil {
    
    public static isStringEmpty(val: string): boolean {
      return (val == null || val == undefined || val.trim() == "") ? true : false;
    }
  
    public static isNumberEmpty(val: number): boolean {
      return (val == null || val == undefined) ? true : false;
    }
  
    public static shuffleArray(array: any[]): any[] {
      let m = array.length, t, i;
  
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
    
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
  
      return array;
    }
  }
  