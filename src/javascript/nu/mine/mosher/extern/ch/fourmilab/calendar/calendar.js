// MODIFIED BY CHRIS MOSHER
/*
       JavaScript functions for the Fourmilab Calendar Converter

                  by John Walker  --  September, MIM
              http://www.fourmilab.ch/documents/calendar/

                This program is in the public domain.
*/
define(["./astro"], function(astro) {

"use strict";

var calendar = {};

/*  You may notice that a variety of array variables logically local
    to functions are declared globally here.  In JavaScript, construction
    of an array variable from source code occurs as the code is
    interpreted.  Making these variables pseudo-globals permits us
    to avoid overhead constructing and disposing of them in each
    call on the function in which whey are used.  */

calendar.J0000 = 1721424.5;                // Julian date of Gregorian epoch: 0000-01-01
calendar.J1970 = 2440587.5;                // Julian date at Unix epoch: 1970-01-01
calendar.JMJD  = 2400000.5;                // Epoch of Modified Julian Date system
calendar.J1900 = 2415020.5;                // Epoch (day 1) of Excel 1900 date system (PC)
calendar.J1904 = 2416480.5;                // Epoch (day 0) of Excel 1904 date system (Mac)

calendar.NormLeap = new Array("Normal year", "Leap year");

/*  WEEKDAY_BEFORE  --  Return Julian date of given weekday (0 = Sunday)
                        in the seven days ending on jd.  */

calendar.weekday_before = function(weekday, jd)
{
    return jd - astro.jwday(jd - weekday);
};

/*  SEARCH_WEEKDAY  --  Determine the Julian date for: 

            weekday      Day of week desired, 0 = Sunday
            jd           Julian date to begin search
            direction    1 = next weekday, -1 = last weekday
            offset       Offset from jd to begin search
*/

calendar.search_weekday = function(weekday, jd, direction, offset)
{
    return calendar.weekday_before(weekday, jd + (direction * offset));
};

//  Utility weekday functions, just wrappers for search_weekday

calendar.nearest_weekday = function(weekday, jd)
{
    return calendar.search_weekday(weekday, jd, 1, 3);
};

calendar.next_weekday = function(weekday, jd)
{
    return calendar.search_weekday(weekday, jd, 1, 7);
};

calendar.next_or_current_weekday = function(weekday, jd)
{
    return calendar.search_weekday(weekday, jd, 1, 6);
};

calendar.previous_weekday = function(weekday, jd)
{
    return calendar.search_weekday(weekday, jd, -1, 1);
};

calendar.previous_or_current_weekday = function(weekday, jd)
{
    return calendar.search_weekday(weekday, jd, 1, 0);
};

//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?

calendar.leap_gregorian = function(year)
{
    return ((year % 4) == 0) &&
            (!(((year % 100) == 0) && ((year % 400) != 0)));
};

//  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date

var GREGORIAN_EPOCH = 1721425.5;

calendar.gregorian_to_jd = function(year, month, day)
{
    return (GREGORIAN_EPOCH - 1) +
           (365 * (year - 1)) +
           Math.floor((year - 1) / 4) +
           (-Math.floor((year - 1) / 100)) +
           Math.floor((year - 1) / 400) +
           Math.floor((((367 * month) - 362) / 12) +
           ((month <= 2) ? 0 :
                               (calendar.leap_gregorian(year) ? -1 : -2)
           ) +
           day);
};

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

calendar.jd_to_gregorian = function(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, year, yearday, leapadj, month, day;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = astro.mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = astro.mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = astro.mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - calendar.gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < calendar.gregorian_to_jd(year, 3, 1)) ? 0
                                                  :
                  (calendar.leap_gregorian(year) ? 1 : 2)
              );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - calendar.gregorian_to_jd(year, month, 1)) + 1;

    return new Array(year, month, day);
};

//  ISO_TO_JULIAN  --  Return Julian day of given ISO year, week, and day

calendar.n_weeks = function(weekday, jd, nthweek)
{
    var j = 7 * nthweek;

    if (nthweek > 0) {
        j += calendar.previous_weekday(weekday, jd);
    } else {
        j += calendar.next_weekday(weekday, jd);
    }
    return j;
};

calendar.iso_to_julian = function(year, week, day)
{
    return day + calendar.n_weeks(0, calendar.gregorian_to_jd(year - 1, 12, 28), week);
};

//  JD_TO_ISO  --  Return array of ISO (year, week, day) for Julian day

calendar.jd_to_iso = function(jd)
{
    var year, week, day;

    year = calendar.jd_to_gregorian(jd - 3)[0];
    if (jd >= calendar.iso_to_julian(year + 1, 1, 1)) {
        year++;
    }
    week = Math.floor((jd - calendar.iso_to_julian(year, 1, 1)) / 7) + 1;
    day = astro.jwday(jd);
    if (day == 0) {
        day = 7;
    }
    return new Array(year, week, day);
};

//  ISO_DAY_TO_JULIAN  --  Return Julian day of given ISO year, and day of year

calendar.iso_day_to_julian = function(year, day)
{
    return (day - 1) + calendar.gregorian_to_jd(year, 1, 1);
};

//  JD_TO_ISO_DAY  --  Return array of ISO (year, day_of_year) for Julian day

calendar.jd_to_iso_day = function(jd)
{
    var year, day;

    year = calendar.jd_to_gregorian(jd)[0];
    day = Math.floor(jd - calendar.gregorian_to_jd(year, 1, 1)) + 1;
    return new Array(year, day);
};

/*  PAD  --  Pad a string to a given length with a given fill character.  */

calendar.pad = function(str, howlong, padwith) {
    var s = str.toString();

    while (s.length < howlong) {
        s = padwith + s;
    }
    return s;
};

//  JULIAN_TO_JD  --  Determine Julian day number from Julian calendar date

var JULIAN_EPOCH = 1721423.5;

calendar.leap_julian = function(year)
{
    return astro.mod(year, 4) == ((year > 0) ? 0 : 3);
};

calendar.julian_to_jd = function(year, month, day)
{

    /* Adjust negative common era years to the zero-based notation we use.  */

    if (year < 1) {
        year++;
    }

    /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */

    if (month <= 2) {
        year--;
        month += 12;
    }

    return ((Math.floor((365.25 * (year + 4716))) +
            Math.floor((30.6001 * (month + 1))) +
            day) - 1524.5);
};

//  JD_TO_JULIAN  --  Calculate Julian calendar date from Julian day

calendar.jd_to_julian = function(td) {
    var z, a, b, c, d, e, year, month, day;

    td += 0.5;
    z = Math.floor(td);

    a = z;
    b = a + 1524;
    c = Math.floor((b - 122.1) / 365.25);
    d = Math.floor(365.25 * c);
    e = Math.floor((b - d) / 30.6001);

    month = Math.floor((e < 14) ? (e - 1) : (e - 13));
    year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
    day = b - d - Math.floor(30.6001 * e);

    /*  If year is less than 1, subtract one to convert from
        a zero based date system to the common era system in
        which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */

    if (year < 1) {
        year--;
    }

    return new Array(year, month, day);
};

//  HEBREW_TO_JD  --  Determine Julian day from Hebrew date

var HEBREW_EPOCH = 347995.5;

//  Is a given Hebrew year a leap year ?

calendar.hebrew_leap = function(year)
{
    return astro.mod(((year * 7) + 1), 19) < 7;
};

//  How many months are there in a Hebrew year (12 = normal, 13 = leap)

calendar.hebrew_year_months = function(year)
{
    return calendar.hebrew_leap(year) ? 13 : 12;
};

//  Test for delay of start of new year and to avoid
//  Sunday, Wednesday, and Friday as start of the new year.

calendar.hebrew_delay_1 = function(year)
{
    var months, day, parts;

    months = Math.floor(((235 * year) - 234) / 19);
    parts = 12084 + (13753 * months);
    day = (months * 29) + Math.floor(parts / 25920);

    if (astro.mod((3 * (day + 1)), 7) < 3) {
        day++;
    }
    return day;
};

//  Check for delay in start of new year due to length of adjacent years

calendar.hebrew_delay_2 = function(year)
{
    var last, present, next;

    last = calendar.hebrew_delay_1(year - 1);
    present = calendar.hebrew_delay_1(year);
    next = calendar.hebrew_delay_1(year + 1);

    return ((next - present) == 356) ? 2 :
                                     (((present - last) == 382) ? 1 : 0);
};

//  How many days are in a Hebrew year ?

calendar.hebrew_year_days = function(year)
{
    return calendar.hebrew_to_jd(year + 1, 7, 1) - calendar.hebrew_to_jd(year, 7, 1);
};

//  How many days are in a given month of a given year

calendar.hebrew_month_days = function(year, month)
{
    //  First of all, dispose of fixed-length 29 day months

    if (month == 2 || month == 4 || month == 6 ||
        month == 10 || month == 13) {
        return 29;
    }

    //  If it's not a leap year, Adar has 29 days

    if (month == 12 && !calendar.hebrew_leap(year)) {
        return 29;
    }

    //  If it's Heshvan, days depend on length of year

    if (month == 8 && !(astro.mod(calendar.hebrew_year_days(year), 10) == 5)) {
        return 29;
    }

    //  Similarly, Kislev varies with the length of year

    if (month == 9 && (astro.mod(calendar.hebrew_year_days(year), 10) == 3)) {
        return 29;
    }

    //  Nope, it's a 30 day month

    return 30;
};

//  Finally, wrap it all up into...

calendar.hebrew_to_jd = function(year, month, day)
{
    var jd, mon, months;

    months = calendar.hebrew_year_months(year);
    jd = HEBREW_EPOCH + calendar.hebrew_delay_1(year) +
    calendar.hebrew_delay_2(year) + day + 1;

    if (month < 7) {
        for (mon = 7; mon <= months; mon++) {
            jd += calendar.hebrew_month_days(year, mon);
        }
        for (mon = 1; mon < month; mon++) {
            jd += calendar.hebrew_month_days(year, mon);
        }
    } else {
        for (mon = 7; mon < month; mon++) {
            jd += calendar.hebrew_month_days(year, mon);
        }
    }

    return jd;
};

/*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
                      This works by making multiple calls to
                      the inverse function, and is this very
                      slow.  */

calendar.jd_to_hebrew = function(jd)
{
    var year, month, day, i, count, first;

    jd = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
    year = count - 1;
    for (i = count; jd >= calendar.hebrew_to_jd(i, 7, 1); i++) {
        year++;
    }
    first = (jd < calendar.hebrew_to_jd(year, 1, 1)) ? 7 : 1;
    month = first;
    for (i = first; jd > calendar.hebrew_to_jd(year, i, calendar.hebrew_month_days(year, i)); i++) {
        month++;
    }
    day = (jd - calendar.hebrew_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
};

/*  EQUINOXE_A_PARIS  --  Determine Julian day and fraction of the
                          September equinox at the Paris meridian in
                          a given Gregorian year.  */

calendar.equinoxe_a_paris = function(year)
{
    var equJED, equJD, equAPP, equParis, dtParis;

    //  September equinox in dynamical time
    equJED = astro.equinox(year, 2);

    //  Correct for delta T to obtain Universal time
    equJD = equJED - (astro.deltat(year) / (24 * 60 * 60));

    //  Apply the equation of time to yield the apparent time at Greenwich
    equAPP = equJD + astro.equationOfTime(equJED);

    /*  Finally, we must correct for the constant difference between
        the Greenwich meridian and that of Paris, 2�20'15" to the
        East.  */

    dtParis = (2 + (20 / 60.0) + (15 / (60 * 60.0))) / 360;
    equParis = equAPP + dtParis;

    return equParis;
};

/*  PARIS_EQUINOXE_JD  --  Calculate Julian day during which the
                           September equinox, reckoned from the Paris
                           meridian, occurred for a given Gregorian
                           year.  */

calendar.paris_equinoxe_jd = function(year)
{
    var ep, epg;

    ep = calendar.equinoxe_a_paris(year);
    epg = Math.floor(ep - 0.5) + 0.5;

    return epg;
};

/*  ANNEE_DE_LA_REVOLUTION  --  Determine the year in the French
                                revolutionary calendar in which a
                                given Julian day falls.  Returns an
                                array of two elements:

                                    [0]  Annee de la Revolution
                                    [1]  Julian day number containing
                                         equinox for this year.
*/

var FRENCH_REVOLUTIONARY_EPOCH = 2375839.5;

calendar.annee_da_la_revolution = function(jd)
{
    var guess = calendar.jd_to_gregorian(jd)[0] - 2,
        lasteq, nexteq, adr;

    lasteq = calendar.paris_equinoxe_jd(guess);
    while (lasteq > jd) {
        guess--;
        lasteq = calendar.paris_equinoxe_jd(guess);
    }
    nexteq = lasteq - 1;
    while (!((lasteq <= jd) && (jd < nexteq))) {
        lasteq = nexteq;
        guess++;
        nexteq = calendar.paris_equinoxe_jd(guess);
    }
    adr = Math.round((lasteq - FRENCH_REVOLUTIONARY_EPOCH) / astro.TropicalYear) + 1;

    return new Array(adr, lasteq);
};

/*  JD_TO_FRENCH_REVOLUTIONARY  --  Calculate date in the French Revolutionary
                                    calendar from Julian day.  The five or six
                                    "sansculottides" are considered a thirteenth
                                    month in the results of this function.  */

calendar.jd_to_french_revolutionary = function(jd)
{
    var an, mois, decade, jour,
        adr, equinoxe;

    jd = Math.floor(jd) + 0.5;
    adr = calendar.annee_da_la_revolution(jd);
    an = adr[0];
    equinoxe = adr[1];
    mois = Math.floor((jd - equinoxe) / 30) + 1;
    jour = (jd - equinoxe) % 30;
    decade = Math.floor(jour / 10) + 1;
    jour = (jour % 10) + 1;

    return new Array(an, mois, decade, jour);
};

/*  FRENCH_REVOLUTIONARY_TO_JD  --  Obtain Julian day from a given French
                                    Revolutionary calendar date.  */

calendar.french_revolutionary_to_jd = function(an, mois, decade, jour)
{
    var adr, equinoxe, guess, jd;

    guess = FRENCH_REVOLUTIONARY_EPOCH + (astro.TropicalYear * ((an - 1) - 1));
    adr = new Array(an - 1, 0);

    while (adr[0] < an) {
        adr = calendar.annee_da_la_revolution(guess);
        guess = adr[1] + (astro.TropicalYear + 2);
    }
    equinoxe = adr[1];

    jd = equinoxe + (30 * (mois - 1)) + (10 * (decade - 1)) + (jour - 1);
    return jd;
};

//  LEAP_ISLAMIC  --  Is a given year a leap year in the Islamic calendar ?

calendar.leap_islamic = function(year)
{
    return (((year * 11) + 14) % 30) < 11;
};

//  ISLAMIC_TO_JD  --  Determine Julian day from Islamic date

var ISLAMIC_EPOCH = 1948439.5;
var ISLAMIC_WEEKDAYS = new Array("al-'ahad", "al-'ithnayn",
                                 "ath-thalatha'", "al-'arb`a'",
                                 "al-khamis", "al-jum`a", "as-sabt");

calendar.islamic_to_jd = function(year, month, day)
{
    return (day +
            Math.ceil(29.5 * (month - 1)) +
            (year - 1) * 354 +
            Math.floor((3 + (11 * year)) / 30) +
            ISLAMIC_EPOCH) - 1;
};

//  JD_TO_ISLAMIC  --  Calculate Islamic date from Julian day

calendar.jd_to_islamic = function(jd)
{
    var year, month, day;

    jd = Math.floor(jd) + 0.5;
    year = Math.floor(((30 * (jd - ISLAMIC_EPOCH)) + 10646) / 10631);
    month = Math.min(12,
                Math.ceil((jd - (29 + calendar.islamic_to_jd(year, 1, 1))) / 29.5) + 1);
    day = (jd - calendar.islamic_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
};

/*  TEHRAN_EQUINOX  --  Determine Julian day and fraction of the
                        March equinox at the Tehran meridian in
                        a given Gregorian year.  */

calendar.tehran_equinox = function(year)
{
    var equJED, equJD, equAPP, equTehran, dtTehran;

    //  March equinox in dynamical time
    equJED = astro.equinox(year, 0);

    //  Correct for delta T to obtain Universal time
    equJD = equJED - (astro.deltat(year) / (24 * 60 * 60));

    //  Apply the equation of time to yield the apparent time at Greenwich
    equAPP = equJD + astro.equationOfTime(equJED);

    /*  Finally, we must correct for the constant difference between
        the Greenwich meridian andthe time zone standard for
	Iran Standard time, 52�30' to the East.  */

    dtTehran = (52 + (30 / 60.0) + (0 / (60.0 * 60.0))) / 360;
    equTehran = equAPP + dtTehran;

    return equTehran;
};


/*  TEHRAN_EQUINOX_JD  --  Calculate Julian day during which the
                           March equinox, reckoned from the Tehran
                           meridian, occurred for a given Gregorian
                           year.  */

calendar.tehran_equinox_jd = function(year)
{
    var ep, epg;

    ep = calendar.tehran_equinox(year);
    epg = Math.floor(ep);

    return epg;
};

/*  PERSIANA_YEAR  --  Determine the year in the Persian
                       astronomical calendar in which a
                       given Julian day falls.  Returns an
             	       array of two elements:

                            [0]  Persian year
                            [1]  Julian day number containing
                                 equinox for this year.
*/


var PERSIAN_EPOCH = 1948320.5;
var PERSIAN_WEEKDAYS = new Array("Yekshanbeh", "Doshanbeh",
                                 "Seshhanbeh", "Chaharshanbeh",
                                 "Panjshanbeh", "Jomeh", "Shanbeh");

calendar.persiana_year = function(jd)
{
    var guess = calendar.jd_to_gregorian(jd)[0] - 2,
        lasteq, nexteq, adr;

    lasteq = calendar.tehran_equinox_jd(guess);
    while (lasteq > jd) {
        guess--;
        lasteq = calendar.tehran_equinox_jd(guess);
    }
    nexteq = lasteq - 1;
    while (!((lasteq <= jd) && (jd < nexteq))) {
        lasteq = nexteq;
        guess++;
        nexteq = calendar.tehran_equinox_jd(guess);
    }
    adr = Math.round((lasteq - PERSIAN_EPOCH) / astro.TropicalYear) + 1;

    return new Array(adr, lasteq);
};

/*  JD_TO_PERSIANA  --  Calculate date in the Persian astronomical
                        calendar from Julian day.  */

calendar.jd_to_persiana = function(jd)
{
    var year, month, day,
        adr, equinox, yday;

    jd = Math.floor(jd) + 0.5;
    adr = calendar.persiana_year(jd);
    year = adr[0];
    equinox = adr[1];
    day = Math.floor((jd - equinox) / 30) + 1;
    
    yday = (Math.floor(jd) - calendar.persiana_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (Math.floor(jd) - calendar.persiana_to_jd(year, month, 1)) + 1;

    return new Array(year, month, day);
};

/*  PERSIANA_TO_JD  --  Obtain Julian day from a given Persian
                    	astronomical calendar date.  */

calendar.persiana_to_jd = function(year, month, day)
{
    var adr, equinox, guess, jd;

    guess = (PERSIAN_EPOCH - 1) + (astro.TropicalYear * ((year - 1) - 1));
    adr = new Array(year - 1, 0);

    while (adr[0] < year) {
        adr = calendar.persiana_year(guess);
        guess = adr[1] + (astro.TropicalYear + 2);
    }
    equinox = adr[1];

    jd = equinox +
            ((month <= 7) ?
                ((month - 1) * 31) :
                (((month - 1) * 30) + 6)
            ) +
    	    (day - 1);
    return jd;
};

/*  LEAP_PERSIANA  --  Is a given year a leap year in the Persian
    	    	       astronomical calendar ?  */

calendar.leap_persiana = function(year)
{
    return (calendar.persiana_to_jd(year + 1, 1, 1) -
    		calendar.persiana_to_jd(year, 1, 1)) > 365;
};

//  LEAP_PERSIAN  --  Is a given year a leap year in the Persian calendar ?

calendar.leap_persian = function(year)
{
    return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
};

//  PERSIAN_TO_JD  --  Determine Julian day from Persian date

calendar.persian_to_jd = function(year, month, day)
{
    var epbase, epyear;

    epbase = year - ((year >= 0) ? 474 : 473);
    epyear = 474 + astro.mod(epbase, 2820);

    return day +
            ((month <= 7) ?
                ((month - 1) * 31) :
                (((month - 1) * 30) + 6)
            ) +
            Math.floor(((epyear * 682) - 110) / 2816) +
            (epyear - 1) * 365 +
            Math.floor(epbase / 2820) * 1029983 +
            (PERSIAN_EPOCH - 1);
};

//  JD_TO_PERSIAN  --  Calculate Persian date from Julian day

calendar.jd_to_persian = function(jd)
{
    var year, month, day, depoch, cycle, cyear, ycycle,
        aux1, aux2, yday;


    jd = Math.floor(jd) + 0.5;

    depoch = jd - calendar.persian_to_jd(475, 1, 1);
    cycle = Math.floor(depoch / 1029983);
    cyear = astro.mod(depoch, 1029983);
    if (cyear == 1029982) {
        ycycle = 2820;
    } else {
        aux1 = Math.floor(cyear / 366);
        aux2 = astro.mod(cyear, 366);
        ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
                    aux1 + 1;
    }
    year = ycycle + (2820 * cycle) + 474;
    if (year <= 0) {
        year--;
    }
    yday = (jd - calendar.persian_to_jd(year, 1, 1)) + 1;
    month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    day = (jd - calendar.persian_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
};

//  MAYAN_COUNT_TO_JD  --  Determine Julian day from Mayan long count

var MAYAN_COUNT_EPOCH = 584282.5;

calendar.mayan_count_to_jd = function(baktun, katun, tun, uinal, kin)
{
    return MAYAN_COUNT_EPOCH +
           (baktun * 144000) +
           (katun  *   7200) +
           (tun    *    360) +
           (uinal  *     20) +
           kin;
};

//  JD_TO_MAYAN_COUNT  --  Calculate Mayan long count from Julian day

calendar.jd_to_mayan_count = function(jd)
{
    var d, baktun, katun, tun, uinal, kin;

    jd = Math.floor(jd) + 0.5;
    d = jd - MAYAN_COUNT_EPOCH;
    baktun = Math.floor(d / 144000);
    d = astro.mod(d, 144000);
    katun = Math.floor(d / 7200);
    d = astro.mod(d, 7200);
    tun = Math.floor(d / 360);
    d = astro.mod(d, 360);
    uinal = Math.floor(d / 20);
    kin = astro.mod(d, 20);

    return new Array(baktun, katun, tun, uinal, kin);
};

//  JD_TO_MAYAN_HAAB  --  Determine Mayan Haab "month" and day from Julian day

var MAYAN_HAAB_MONTHS = new Array("Pop", "Uo", "Zip", "Zotz", "Tzec", "Xul",
                                  "Yaxkin", "Mol", "Chen", "Yax", "Zac", "Ceh",
                                  "Mac", "Kankin", "Muan", "Pax", "Kayab", "Cumku", "Uayeb");

calendar.jd_to_mayan_haab = function(jd)
{
    var lcount, day;

    jd = Math.floor(jd) + 0.5;
    lcount = jd - MAYAN_COUNT_EPOCH;
    day = astro.mod(lcount + 8 + ((18 - 1) * 20), 365);

    return new Array (Math.floor(day / 20) + 1, astro.mod(day, 20));
};

//  JD_TO_MAYAN_TZOLKIN  --  Determine Mayan Tzolkin "month" and day from Julian day

var MAYAN_TZOLKIN_MONTHS = new Array("Imix", "Ik", "Akbal", "Kan", "Chicchan",
                                     "Cimi", "Manik", "Lamat", "Muluc", "Oc",
                                     "Chuen", "Eb", "Ben", "Ix", "Men",
                                     "Cib", "Caban", "Etznab", "Cauac", "Ahau");

calendar.jd_to_mayan_tzolkin = function(jd)
{
    var lcount;

    jd = Math.floor(jd) + 0.5;
    lcount = jd - MAYAN_COUNT_EPOCH;
    return new Array (astro.amod(lcount + 20, 20), astro.amod(lcount + 4, 13));
};

//  BAHAI_TO_JD  --  Determine Julian day from Bahai date

var BAHAI_EPOCH = 2394646.5;
var BAHAI_WEEKDAYS = new Array("Jam�l", "Kam�l", "Fid�l", "Id�l",
                               "Istijl�l", "Istiql�l", "Jal�l");

calendar.bahai_to_jd = function(major, cycle, year, month, day)
{
    var gy;

    gy = (361 * (major - 1)) + (19 * (cycle - 1)) + (year - 1) +
         calendar.jd_to_gregorian(BAHAI_EPOCH)[0];
    return calendar.gregorian_to_jd(gy, 3, 20) + (19 * (month - 1)) +
           ((month != 20) ? 0 : (calendar.leap_gregorian(gy + 1) ? -14 : -15))  +
           day;
};

//  JD_TO_BAHAI  --  Calculate Bahai date from Julian day

calendar.jd_to_bahai = function(jd)
{
    var major, cycle, year, month, day,
        gy, bstarty, bys, days, bld;

    jd = Math.floor(jd) + 0.5;
    gy = calendar.jd_to_gregorian(jd)[0];
    bstarty = calendar.jd_to_gregorian(BAHAI_EPOCH)[0];
    bys = gy - (bstarty + (((calendar.gregorian_to_jd(gy, 1, 1) <= jd) && (jd <= calendar.gregorian_to_jd(gy, 3, 20))) ? 1 : 0));
    major = Math.floor(bys / 361) + 1;
    cycle = Math.floor(astro.mod(bys, 361) / 19) + 1;
    year = astro.mod(bys, 19) + 1;
    days = jd - calendar.bahai_to_jd(major, cycle, year, 1, 1);
    bld = calendar.bahai_to_jd(major, cycle, year, 20, 1);
    month = (jd >= bld) ? 20 : (Math.floor(days / 19) + 1);
    day = (jd + 1) - calendar.bahai_to_jd(major, cycle, year, month, 1);

    return new Array(major, cycle, year, month, day);
};

//  INDIAN_CIVIL_TO_JD  --  Obtain Julian day for Indian Civil date

var INDIAN_CIVIL_WEEKDAYS = new Array(
    "ravivara", "somavara", "mangalavara", "budhavara",
    "brahaspativara", "sukravara", "sanivara");

calendar.indian_civil_to_jd = function(year, month, day)
{
    var Caitra, gyear, leap, start, jd, m;

    gyear = year + 78;
    leap = calendar.leap_gregorian(gyear);     // Is this a leap year ?
    start = calendar.gregorian_to_jd(gyear, 3, leap ? 21 : 22);
    Caitra = leap ? 31 : 30;

    if (month == 1) {
        jd = start + (day - 1);
    } else {
        jd = start + Caitra;
        m = month - 2;
        m = Math.min(m, 5);
        jd += m * 31;
        if (month >= 8) {
            m = month - 7;
            jd += m * 30;
        }
        jd += day - 1;
    }

    return jd;
};

//  JD_TO_INDIAN_CIVIL  --  Calculate Indian Civil date from Julian day

calendar.jd_to_indian_civil = function(jd)
{
    var Caitra, Saka, greg, greg0, leap, start, year, yday, mday;

    Saka = 79 - 1;                    // Offset in years from Saka era to Gregorian epoch
    start = 80;                       // Day offset between Saka and Gregorian

    jd = Math.floor(jd) + 0.5;
    greg = calendar.jd_to_gregorian(jd);       // Gregorian date for Julian day
    leap = calendar.leap_gregorian(greg[0]);   // Is this a leap year?
    year = greg[0] - Saka;            // Tentative year in Saka era
    greg0 = calendar.gregorian_to_jd(greg[0], 1, 1); // JD at start of Gregorian year
    yday = jd - greg0;                // Day number (0 based) in Gregorian year
    Caitra = leap ? 31 : 30;          // Days in Caitra this year

    if (yday < start) {
        //  Day is at the end of the preceding Saka year
        year--;
        yday += Caitra + (31 * 5) + (30 * 3) + 10 + start;
    }

    yday -= start;
    if (yday < Caitra) {
        month = 1;
        day = yday + 1;
    } else {
        mday = yday - Caitra;
        if (mday < (31 * 5)) {
            month = Math.floor(mday / 31) + 2;
            day = (mday % 31) + 1;
        } else {
            mday -= 31 * 5;
            month = Math.floor(mday / 30) + 7;
            day = (mday % 30) + 1;
        }
    }

    return new Array(year, month, day);
};

return calendar;

});
