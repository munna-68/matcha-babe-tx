# Palette sampling: @matchababetx Instagram grid (reference screenshots)

Source: screenshots ref-01.webp to ref-06.webp in `reference/`. Screenshots are compressed (Instagram web), so all values are approximate. No design interpretation is included.

Method key:
- **median (filtered)**: per-channel median of pixels inside the box/disc that pass a colour filter (e.g. green-dominant only). Used as the primary value.
- **mode**: most common colour bin (16 levels per channel) in the same pixel set, as a cross-check.
- Coordinates are full-resolution pixels (x0,y0,x1,y1) in each source file. Image sizes: ref-01 2000x1116, ref-02 2000x1269, ref-03 2000x1213, ref-04 2000x1088, ref-05 2000x1226, ref-06 2000x1173. ref-03 is RGBA; alpha was dropped.

## Named samples

| # | Name | Hex (median) | Hex (mode) | Source | Approx coords | Method | Px used |
|---|---|---|---|---|---|---|---|
| 1 | Logo circle dark green | #013E17 | #083818 | ref-01.webp | disc c=(700,153) r=70 | dark filter, median; disc r70 around logo centre; pixels lum<100 only (excludes cream lettering) | 9345 |
| 2 | Logo lettering cream | #E5E7D6 | #E8E8D8 | ref-01.webp | disc c=(700,153) r=80 | cream_lt filter, median; disc r80; pixels lum>170 only | 5954 |
| 3 | Iced latte green (cup, r1c5) | #4E6D37 | #486838 | ref-01.webp | (1655,700,1750,800) | green_mid filter, median; box; green-dominant pixels only | 1602 |
| 4 | Hot pink wall (weekend residency tile) | #B86F82 | #B87888 | ref-02.webp | (1222,20,1606,530) | pink filter, median; box; pink-dominant pixels only (text/cup excluded) | 106853 |
| 5 | Iced latte green (padel cup, r1c3) | #4B6C2A | #486828 | ref-02.webp | (1000,240,1040,275) | green_mid filter, median; small box on cup body | 577 |
| 6 | Hot pink wall (brick, r2c4) | #CE4266 | #C83858 | ref-03.webp | (1215,545,1575,1025) | pink filter, median; box; pink-dominant pixels only | 67547 |
| 7 | Pink straws (r2c5) | #BC717F | #A85868 | ref-03.webp | (1770,630,1860,750) | pink filter, median; box; pink-dominant pixels only (thin straws, approximate) | 935 |
| 8 | Dark counter (bar front) | #1F1D16 | #181818 | ref-03.webp | (900,880,990,960) | dark filter, median; box on bar front; lum<100 pixels only. Pixels here are neutral near-black, not green (checked) | 6480 |
| 9 | Dark green apron | #283127 | #282828 | ref-03.webp | (1030,752,1060,778) | darkgreen filter, median; small box on apron; dark-green pixels only | 568 |
| 10 | Cream logo banner cloth (counter) | #DBCFC3 | #D8C8B8 | ref-03.webp | (1005,760,1095,1000) | cream filter, median; box; cream pixels only (black print excluded) | 90 |
| 11 | Cream tote bag (r2c3) | #D4C9BF | #D8C8C8 | ref-04.webp | (900,540,1140,960) | cream filter, median; box; cream pixels only (black print and green grid excluded) | 52258 |
| 12 | Iced latte green (Lucky Charms cup, r1c4) | #A9C47F | #A8C888 | ref-04.webp | (1225,320,1270,360) | green_mid filter, median; small box on cup body | 478 |
| 13 | Lavender drink (Lavender Haze, r1c4) | #CBB6EA | #E8D8F8 | ref-04.webp | (1420,190,1480,260) | lavender filter, median; box; lavender pixels only | 505 |
| 14 | Blue coconut drink (r1c4) | #0C509E | #084898 | ref-04.webp | (1455,340,1505,400) | blue filter, median; box; blue pixels only | 2818 |
| 15 | Strawberry layer, bottom of cup (r1c4) | #632124 | #580808 | ref-04.webp | (1320,380,1420,460) | reddish filter, median; box; red-dominant pixels only. Reads as deep red/maroon in this capture, not light pink (checked) | 1934 |
| 16 | Green tile (bunny tile, r1c2) | #5F7B4F | #587848 | ref-04.webp | (500,300,640,490) | green_mid filter, median; box; green pixels only (grout excluded) | 1856 |
| 17 | Green/white checker: green squares | #077034 | #086828 | ref-05.webp | (1560,505,1910,590) | green filter, median; top band of checker tile; green pixels only | 14318 |
| 18 | Green/white checker: white squares | #E6E8E9 | #E8E8E8 | ref-05.webp | (1560,505,1910,590) | white filter, median; top band of checker tile; white pixels only | 13866 |
| 19 | Iced latte green (checker cup, r2c5) | #85A546 | #98B858 | ref-05.webp | (1650,660,1800,760) | green_mid filter, median; box on cup; green pixels only | 11411 |
| 20 | Green tile (loyalty card tile, r2c4) | #3A561E | #385818 | ref-06.webp | (1195,525,1540,570) | green_mid filter, median; top band of green tile wall; green pixels only | 625 |
| 21 | Dark green loyalty card | #172212 | #182818 | ref-06.webp | (1240,600,1290,640) | darkgreen filter, median; box on card corner; dark-green pixels only | 2000 |
| 22 | Matcha layer (glass, r2c3) | #4B7008 | #486808 | ref-06.webp | (960,820,1040,860) | green_mid filter, median; box on matcha layer | 892 |

## Dominant colours per file (PIL quantize, 10 colours, median-cut, whole image)

Percentages are the share of all pixels assigned to each quantized colour. Whole-image quantize includes UI chrome (black Instagram background, buttons) where present.

| File | Top 10 colours (share) |
|---|---|
| ref-01.webp | #0C1013 46.4%, #664432 12.8%, #E4DDCC 11.9%, #928568 10.7%, #28301B 8.2%, #361207 3.7%, #0E1107 3.2%, #230604 1.6%, #0D1115 1.0%, #081110 0.3% |
| ref-02.webp | #AE8E7A 13.9%, #736045 12.9%, #E5E6DB 10.5%, #170B0A 10.3%, #6F8066 9.8%, #B2B6A2 9.1%, #35482E 9.0%, #2A2317 8.5%, #D7C4B0 8.3%, #6F3324 7.8% |
| ref-03.webp | #B99D84 14.0%, #0E0F11 13.8%, #202F2D 12.1%, #C1C1B2 11.5%, #5B5F43 11.1%, #83866E 8.7%, #926554 8.6%, #DBC5AB 7.5%, #E7E6DA 7.3%, #673A33 5.3% |
| ref-04.webp | #0C1013 14.9%, #A88F7A 13.4%, #343327 12.7%, #75795A 11.2%, #673F2D 10.5%, #B3B7A7 9.9%, #D4BFAD 9.6%, #E5E1D2 7.2%, #172421 7.1%, #090706 3.5% |
| ref-05.webp | #0B1112 15.3%, #DFD8C7 14.3%, #A8B79E 11.8%, #503D24 11.1%, #7F7F5E 11.0%, #476F49 9.2%, #192016 8.7%, #AF8765 7.1%, #040504 6.5%, #062D14 5.0% |
| ref-06.webp | #B39F8D 14.3%, #E5DFD5 13.5%, #0C1012 13.0%, #B6C3B7 12.0%, #383225 9.2%, #7E8E6F 9.2%, #79684A 8.1%, #485C3B 7.8%, #050403 6.6%, #151F14 6.3% |

