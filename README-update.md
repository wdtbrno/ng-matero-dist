# wdtbrno/ng-matero-dist

Repo https://github.com/wdtbrno/ng-matero-dist obsahuje primo instalovatelny npm balicek misto @ng-matero/extensions

>  ~~"@ng-matero/extensions": "^11.5.1"~~  
>  "@ng-matero/extensions": "https://github.com/wdtbrno/ng-matero-dist#11.5.x"

Vychazi z https://github.com/ng-matero/extensions

Vlastni upravy jsou v https://github.com/wdtbrno/ng-matero, kde jsou trakovany zmenu a mergovany vlastni upravy. Branch 11 od masteru se lisila tak, ze nesel puzit cherry-pick.

**POZOR**: Po prenuti branche je treba vycistit ignorovane soubory (node_modules, dist ...), napr: ```git clean -d -f -X```

To je distribuovatelna verze, ktera vznikne v dist/extensions adresari.
Postup se lisi podle verze. V package.json je potreba najit aktualni prikazy pro publish.

To co vznikne v dist/extensions je treba nakopirovat do tohoto repo (prislusne branche) + comit + push.

