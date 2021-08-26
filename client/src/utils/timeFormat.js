const timeFormat = (date)=>{
   let time, year, month, day;
   const s = date.split("T");
   const t = parseInt(s[1].substring(0, 2));
   if(t > 12){
       time = `${(t - 12) + s[1].substring(2,5)} PM`;
   }else{
       time = `${t + s[1].substring(2,5)} AM`;
   }
   year = s[0].substring(0,4);
   day = s[0].substring(8,10)
   switch(s[0].substring(5,7)){
       case("01"):
          month = 'Jan'
          return day +" "+ month +" "+" "+ year +" "+" at "+ time;
       case("02"):
          month = 'Feb'
          return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("03"):
          month = 'Mar'
          return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("04"):
           month = 'Apr'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("05"):
           month = 'May'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("06"):
           month = 'Jun'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("07"):
           month = 'Jul'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("08"):
           month = 'Aug'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("09"):
           month = 'Sept'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("10"):
           month = 'Oct'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("11"):
           month = 'Nov'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
        case("12"):
           month = 'Dec'
           return day +" "+ month +" "+" "+ year +" "+" at "+ time;
   }

   return day +" "+ month +" "+" "+ year +" "+" at "+ time;
};
export default timeFormat;