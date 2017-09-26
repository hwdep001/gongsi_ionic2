declare global {
  interface Date {
    yyMMdd(): string;
    yyyy_MM_dd_HH_mm_ss (): string;
  }

  interface Array<T> {
    pushArray(array: Array<T>): void;
  }
}

Date.prototype.yyMMdd = function(): string {
  var yy = this.getFullYear().toString().slice(2, 4);
  var MM = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [yy,
          (MM>9 ? '' : '0') + MM,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

Date.prototype.yyyy_MM_dd_HH_mm_ss = function(): string {
  var yyyy = this.getFullYear();
  var MM = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();
  var HH = this.getHours();
  var mm = this.getMinutes();
  var ss = this.getSeconds();

  return [yyyy, "-",
          (MM>9 ? '' : '0') + MM, "-",
          (dd>9 ? '' : '0') + dd, " ",
          (HH>9 ? '' : '0') + HH, ":",
          (mm>9 ? '' : '0') + mm, ":",
          (ss>9 ? '' : '0') + ss
         ].join('');
};

Array.prototype.pushArray = function(array) {
  this.push.apply(this, array);
};

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

    public static getWordLevels() {
      let levels = new Array<any>();
      levels.push({key:2, value:'Very easy'});
      levels.push({key:1, value:'Easy'});
      levels.push({key:0, value:'Nomal'});
      levels.push({key:-1, value:'Difficult'});
      levels.push({key:-2, value:'Very difficult'});

      return levels;
    }

    public static getWordCounts() {
      let counts = new Array<any>();

      counts.push({key: 0, value: "순서대로(최대 200개)"});
      for(let i=20; i<=100; i+=10) {
        counts.push({key: i, value: "랜덤 " + i + "개"});
      }

      return counts;
    }
  }
  