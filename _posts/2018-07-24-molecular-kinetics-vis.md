---
layout: post
title: Molecular kinetics visualisation
date: 2018-07-24 09:25:00 +0100
author: Mike
---

I always had this idea of making an interactive teaching aid that shows molecules moving in a box in order to demonstrate different aspects of chemistry and physics e.g. [the kinetic theory of gasses][ktog] or [the ideal gas law][igl]. 

It's an important subject taught throughout [school][school] that requires linking mental visualisations to some abstract scientific concepts. An interactive tool would no doubt be engaging and encouraging to those struggling to learning this subject.

This display definitely is not a new concept and exists in many forms online (there's even an example on [the kinetic theory of gasses page][ktog] on wikipedia), but I wanted to make my own and learn some D3 so had a go myself.

I came across [this example of bouncing balls][atul] with some interactivity, which pretty much does exactly what I want. So I altered a few properties and removed/added some different functionality. You can increase the temperature and watch the molecules move faster. The molecules are blue, but when they reach an activation energy, they turn red. 

{% include molecular-kinetic-vis/molecular-kinetic-vis.html %}

As a bonus, the interactive itself is quite hypnotic, so on a big screen it attracts attention which is perfect for engagement events. This display was used during Science Uncovered Manchester European Researchers Night at Manchester Museum 2017 where demonstrators could talk about a number of concepts such as; the conservation of energy; molecular reactions; activation energy; pressure, temperature and volume; kinetic energy; adiabatic processes; diffusion. The list is endless really!

For the moment this is all quantitative, although it would be really great if the thermodynamic and kinetic properties of the molecules were displayed and could be changed, for instance displaying statistical properties of the molecules e.g. the [Maxwell–Boltzmann distribution][mbd]. I can imagine dragging and dropping the confines of the box to change the temperature and speed of the molecules within, or adding in a heated surface to watch a temperature gradient. Chemical reactions between the species would also be a good way of demonstrating gaseous reactions. Actually, introducing a liquid layer could also show concepts such as equilibrium vapour pressure, or saturation vapour pressure. Endless possibilities! Hopefully I get a change to incorporate some of these aspects to this demo in the near future. The code is available [here][code].

[igl]: https://en.wikipedia.org/wiki/Ideal_gas_law
[school]: http://www.bbc.co.uk/schools/gcsebitesize/science/aqa/heatingandcooling/heatingrev2.shtml
[ktog]: https://en.wikipedia.org/wiki/Kinetic_theory_of_gases
[atul]: http://bl.ocks.org/atul-github/0019158da5d2f8499f7f
[mbd]: https://en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution
[code]: https://gist.github.com/Mbex/09be276a82679eaa5082c41d33de49b0