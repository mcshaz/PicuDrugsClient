# PicuDrugsClient

In development

An rewritting of the picudrugs calculator (also on github) for the modern era, including
For the dev
1) more thorough unit testing
2) dependency injection
3) .net core back end
4) typescript & vue front end 
for the user
1) all drug data is stored in a browser indexeddb storage, and synced with the server. Thus the calculator will work, even if offline, & for those on slow connections (NB hospitals in the south pacific), much faster.
2) much more mobile device friendly - bootstrap mobile first
3) The bolus drug calculator will allow indenting & multiple dose increments. This is predominantly to present escalating doses of adenosine.
4) automatic redirect to the old calculator for legacy browser users
5)a 'print all' function, which will produce the calculations for a wide range of ages to be stored in a folder and used in event of a power failure.
