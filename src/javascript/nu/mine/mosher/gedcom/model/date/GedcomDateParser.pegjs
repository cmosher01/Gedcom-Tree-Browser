start
  = date_int
  / date_phrase
  / date_period
  / date_range
  / date_approx
  / date

date_int
  = "INT" S ymd:date S date_phrase { return ymd; }

date_phrase
  = "(" str:[^)]* ")" { return str.join(""); }

date_period
  = "FROM" S f:date S "TO" S t:date { return { from:f, to:t }; }
  / "FROM" S f:date                 { return { from:f       }; }
  /                   "TO" S t:date { return {         to:t }; }

date_range
  = "BET" S a:date S "AND" S b:date { return { after:a, before:b }; }
  / "AFT" S a:date                  { return { after:a           }; }
  /                  "BEF" S b:date { return {          before:b }; }

date_approx
  = "ABT" S ymd:date { ymd.approx=true; return ymd; }
  / "CAL" S ymd:date { ymd.approx=true; return ymd; }
  / "EST" S ymd:date { ymd.approx=true; return ymd; }

date
  = "@#D" cal:"GREGORIAN" "@" OS ymd:date_gregor { return ymd; }
  / "@#D" cal:"JULIAN"    "@" OS ymd:date_julian { ymd.julian = true; return ymd; }
  / "@#D" cal:"HEBREW"    "@" OS ymd:date_hebrew { ymd.hebrew = true; return ymd; }
  / "@#D" cal:"FRENCH R"  "@" OS ymd:date_french { ymd.french = true; return ymd; }
  / "@#D" cal:other_cal   "@" OS str:.*          { return cal+": "+str.join(""); }
  /                              ymd:date_slash  { ymd.julian = true; return ymd; }
  /                              ymd:date_gregor { return ymd; }

other_cal
  = (! known_cal cal:[^@]+) { return cal.join(""); }

known_cal
  = "GREGORIAN" / "JULIAN" / "HEBREW" / "FRENCH R"

date_gregor
  = ymd:date_gregor_raw S e:epoch { ymd.year *= e; return ymd; }
  / ymd:date_gregor_raw

date_julian
  = ymd:date_julian_raw S e:epoch { ymd.year *= e; return ymd; }
  / ymd:date_julian_raw

date_hebrew
  = d:day S m:month_hebr S y:year { return { day:d, month:m, year:y }; }
  /         m:month_hebr S y:year { return { day:0, month:m, year:y }; }
  /                        y:year { return { day:0, month:0, year:y }; }

date_french
  = d:day S m:month_fren S y:year { return { day:d, month:m, year:y }; }
  /         m:month_fren S y:year { return { day:0, month:m, year:y }; }
  /                        y:year { return { day:0, month:0, year:y }; }

date_slash
  = d:day S m:month_engl S y:year_slash { return { day:d, month:m, year:y }; }
  /         m:month_engl S y:year_slash { return { day:0, month:m, year:y }; }
  /                        y:year_slash { return { day:0, month:0, year:y }; }

date_gregor_raw
  = d:day S m:month_engl S y:year { return { day:d, month:m, year:y }; }
  /         m:month_engl S y:year { return { day:0, month:m, year:y }; }
  /                        y:year { return { day:0, month:0, year:y }; }

date_julian_raw
  = d:day S m:month_engl S y:year_julian { return { day:d, month:m, year:y }; }
  /         m:month_engl S y:year_julian { return { day:0, month:m, year:y }; }
  /                        y:year_julian { return { day:0, month:0, year:y }; }

year_julian
  = year_slash
  / year

year_slash
  = y:year "/" N { return y+1; }

year = y:N { return (y==0) ? null : y; }

day = N

N = digits:[0-9]+ { return parseInt(digits.join(""),10); }

S
  = (" ")+

OS
  = (" ")*

epoch
  = ("BC" / "B.C." / "BCE" / "B.C.E.") { return -1; }
  / ("AD" / "A.D." /  "CE" /   "C.E.") { return  1; }

month_engl
  = "JAN" { return  1; }
  / "FEB" { return  2; }
  / "MAR" { return  3; }
  / "APR" { return  4; }
  / "MAY" { return  5; }
  / "JUN" { return  6; }
  / "JUL" { return  7; }
  / "AUG" { return  8; }
  / "SEP" { return  9; }
  / "OCT" { return 10; }
  / "NOV" { return 11; }
  / "DEC" { return 12; }

month_fren
  = "VEND" { return  1; }
  / "BRUM" { return  2; }
  / "FRIM" { return  3; }
  / "NIVO" { return  4; }
  / "PLUV" { return  5; }
  / "VENT" { return  6; }
  / "GERM" { return  7; }
  / "FLOR" { return  8; }
  / "PRAI" { return  9; }
  / "MESS" { return 10; }
  / "THER" { return 11; }
  / "FRUC" { return 12; }
  / "COMP" { return 13; }

month_hebr
  = "NSN" { return  1; }
  / "IYR" { return  2; }
  / "SVN" { return  3; }
  / "TMZ" { return  4; }
  / "AAV" { return  5; }
  / "ELL" { return  6; }
  / "TSH" { return  7; }
  / "CSH" { return  8; }
  / "KSL" { return  9; }
  / "TVT" { return 10; }
  / "SHV" { return 11; }
  / "ADR" { return 12; }
  / "ADS" { return 13; }
