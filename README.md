# README

https://brave-material-base.vercel.app/

This tool generates a baseline Material theme for Brave-Core. This is slightly
complicated by the fact that the Nala and Chromium baseline colors don't
perfectly overlap.

The basic algorithm is this:
1. Get all the Nala variables
2. Get all the Chromium variables
3. Generate a palette based on the Nala base color (can be changed in the input)

Include all the Nala hardcoded colors - some of these have been tweaked by
@aguscruiz by hand, so we don't want to override them with the generated
palette.

For each remaining Chromium color, override it with the generated palette color.

## Sources

Nala colors are extracted from https://nala.bravesoftware.com/css/variables.css
Chromium colors are extracts from https://raw.githubusercontent.com/brave/chromium/main/ui/color/color_id.h
