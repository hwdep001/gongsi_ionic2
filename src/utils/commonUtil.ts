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

    public static getCurrentDate() {
      let result: string;

      let now = new Date();
      const tz = now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000);
      now.setTime(tz);

      result =
        this.leadingZeros(now.getFullYear(), 4) + '-' +
        this.leadingZeros(now.getMonth() + 1, 2) + '-' +
        this.leadingZeros(now.getDate(), 2) + ' ' +
    
        this.leadingZeros(now.getHours(), 2) + ':' +
        this.leadingZeros(now.getMinutes(), 2) + ':' +
        this.leadingZeros(now.getSeconds(), 2);

      return result;
    }

    private static leadingZeros(n, digits) {
      let zero = '';
      n = n.toString();
    
      if (n.length < digits) {
        for (let i = 0; i < digits - n.length; i++)
          zero += '0';
      }
      return zero + n;
    }
  }
  