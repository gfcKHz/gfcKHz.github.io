---
title: Ghost in the Capture — Latent Space
hide:
  - title
---

I grabbed my headphones (Sony WH-1000XM4) and listened to one of my favorite songs by On Broken Wings called [The Spawning of Progression](https://youtu.be/8NwDQzapNhE?t=170). After saving the track as a wav (via the sample chrome extension) and uploading it to a stem splitter (moises), the isolated bass revealed something unexpected. What initially seemed like a hidden tonal [state](https://on.soundcloud.com/VgpbeVAbJzqlP0JCuu) (maybe a pitch inversion of the noise at the end of the song), turned out to be an artifact: a reconstruction (hallucinated) of the original sample by the autoencoder in the stem splitter. 

After listening to the whole song, there are wind chimes faintly present at the beginning that I think correspond to the sound I was hearing towards the end (with the bass isolated). Ultimately, this is important because this reframing of the source material rotates the perceptual modality we operate from by shifting not just what is heard in tonal space but where one is positioned relative to the source and its constituent decompositions, revealing different transformations.

### Johnson–Lindenstrauss

The Johnson–Lindenstrauss lemma shows that a projection can preserve relational structure even when the coordinate system changes. Formally, for any $0<\varepsilon<1$ and finite $X \subset \mathbb{R}^n$ there exists $f: \mathbb{R}^n \rightarrow \mathbb{R}^k$, $k = O(\varepsilon^{-2} \log |X|)$, such that:

$$
\large (1-\varepsilon)\|x-y\|_2^2 \;\le\; \|f(x)-f(y)\|_2^2 \;\le\; (1+\varepsilon)\|x-y\|_2^2 \quad \forall x,y \in X.
$$

The [JL Lemma Beyond Euclidean Geometry](https://arxiv.org/abs/2510.22401) talk at FWCG 2025 was interesting. Their extension to pseudo-Euclidean signatures and generalized power-distance matrices seems like the right toolkit you need once drift and noise whitening push a capture cloud off a tidy $\mathbb{R}^p$ baseline. Imagine two channels occupying disjoint kernels (time-scales). Take a Coltrane [sample](https://www.youtube.com/watch?v=VWhJ7hlDwMk) and encode it as a drift feature and a drum [sequence](https://youtu.be/b9ilXLsz0KE) rendered as a rhythmic probe. The bridge between those abstractions could potentially sit in the Gromov–Hausdorff regime, where we stop comparing coordinates and instead compare the metric spaces themselves up to isometry. JL provides the distortion bounds that let us embed each channel into a common space without losing the pairwise distance structure and Gromov-Hausdorff tells us whether differently instrumented spaces still settle into the same rhythm and coherence.  

### Gromov–Hausdorff

Mémoli’s CIRM tutorial frames the Gromov–Hausdorff distance by embedding both compact metric spaces into a “sufficiently rich” ambient space $(Z,d_Z)$ and measuring the Hausdorff distance between the images:
$$
\large d_{GH}(X,Y) \;=\; \inf_{Z,\phi_X,\phi_Y} d_{\mathcal{H}}^{Z}\!\left(\phi_X(X),\,\phi_Y(Y)\right),
$$
where $\phi_X : X \rightarrow Z$ and $\phi_Y : Y \rightarrow Z$ range over all isometric embeddings.[14,15] This viewpoint emphasizes the search for a shared latent space where we can compare copies directly. Either way, the metric lets us compare latent clouds that arise from wildly different instrumentation. A high-fidelity sax stem drifting in a covariance-adapted $\mathbb{R}^p$ can be matched against a percussion stem traced through a symbolic proof tree: the GH distance ignores how these spaces are parameterized and instead tracks whether the relational loops (motifs, cadences, or tempo envelopes) survive. When we glue GH onto a JL pipeline, we flatten each capture only as far as local distortions allow and then measure whether the rhythmic coherence still overlays in an isometry class sense. A low $d_{GH}$ tells us the two renderings encode the same musical ghost, even if one lives in accelerometer counts and the other in decision-logic kernels.  

Practically, you build the bridge by sampling anchor phrases or phase-aligned downbeats, wiring them into a correspondence, and letting an optimal-transport or barycentric algorithm tighten the distortion.[16] The residual becomes an actionable “metric mismatch” that can be pushed back into the signal chain: adjust whitening, reweigh drift features, or re-synchronize stems until the GH witness falls beneath a perceptual budget. GH therefore acts less like an abstract invariant and more like a control knob for keeping multiple sensing modalities faithful to the same improvisation.  

### Heilbronn Triangulation

A 360° polar grid partitioned into twelve equal sectors (nodes pinned to orbital longitudes) gives a strict geometric surface that lines up with Coltrane’s 12-node circle of tones and the tonnetz’s 12 pitch classes/24 triads. In that shared symmetry, sector indices map directly onto circle-of-fifths coordinates, so the capture pipeline could potentially become a deterministic analogue of the Heilbronn triangulation problem: place $n$ points inside a disk so every triangle determined by three points has area at least $c/n^2$ for some constant $c$. Brass packages the proof sketches into a discrete-geometry playbook that overlays nicely on twelve-tone lattices. The polar grid becomes a timestamped tiling; Heilbronn’s constraint forces any trio of simultaneous stems (horn, drums, strings) to span a triangle whose area lower bound blocks degeneracy. Once the triangle areas are bounded, JL can reduce the ambient dimension without collapsing the simplices, and GH can compare the resulting triangulations across sensing kernels. Treat the grid as a control surface that dictates how much simplex area each trio of stems must maintain during an improvisation.
### Tonnetz as Rotational Lattice

Coltrane’s circle of tones is a tonnetz in disguise (a 12-node rotational lattice where translations correspond to voice-leading moves). Neo-Riemannian theory packages those moves into the $P$, $L$, and $R$ operators. Overlay the polar grid on the lattice and stacking stems becomes a coset-selection problem. The “rotational lattice” phrase just means each channel walks that tonnetz, so coherence demands their paths align modulo the symmetries. Yoneda’s lemma keeps the categorical metaphysics honest: chords, angular sectors, and stems only matter through their relations. JL stabilizes distances on the lattice, GH/GW checks whether two renderings (say a Coltrane stem and a Whiplash percussion overlay) trace isometric loops, and Heilbronn triangulation keeps the local simplices nondegenerate while the tonnetz preserves the global rotation matrix.

The aim is to make the rotational lattice auditable: a discrete engine for latent space where any combination of stems respects both the Heilbronn area budget and the tonnetz symmetries. Hardware micro-fluctuations (drift, jitter, PLL relock cadence) feed into the lattice as auxiliary coordinates, so the stem splitter behaves like an audio side-channel: every hallucinated stem carries the user's geometric and hardware [fingerprint](entropy.md). 

### Listen

<div class="sc-inline-player">
  <iframe
    title="Johnson–Lindenstrauss track"
    width="100%"
    height="166"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2211134558&color=%23050505&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
  </iframe>
  <div class="sc-player-meta">
    <a href="https://soundcloud.com/daejjeon" title="crocodile" target="_blank" rel="noopener">crocodile</a>
    <span> · </span>
    <a href="https://soundcloud.com/daejjeon/cm-transform" title="Johnson–Lindenstrauss" target="_blank" rel="noopener">Johnson–Lindenstrauss</a>
  </div>
</div>

---

## References

1. Elhage, Nelson, et al. "Toy Models of Superposition." *Transformer Circuits*, 2022. https://transformer-circuits.pub/2022/toy_model/index.html.
2. Anthropic. "Linebreaks: Spatial Structure in Language Models." *Transformer Circuits*, 2025. https://transformer-circuits.pub/2025/linebreaks/index.html.
3. Hirschberg, D. S. "Algorithms for the Longest Common Subsequence Problem." *Journal of the ACM* 24, no. 4 (1977): 664–675.
4. Baraniuk, Richard G., and Mark A. Davenport. "A Simple Proof of the Restricted Isometry Property for Random Matrices." *Constructive Approximation* 28, no. 3 (2008): 253–263.
5. Krahmer, Felix, and Rachel Ward. "New and Improved Johnson–Lindenstrauss Embeddings via the Restricted Isometry Property." *SIAM Journal on Mathematical Analysis* 43, no. 3 (2011): 1269–1281.
6. Ailon, Nir, and Bernard Chazelle. "The Fast Johnson–Lindenstrauss Transform and Approximate Nearest Neighbors." *SIAM Journal on Computing* 39, no. 1 (2009): 302–322.
7. Baraniuk, Richard G., and Michael B. Wakin. "Random Projections of Smooth Manifolds." *Foundations of Computational Mathematics* 9, no. 1 (2009): 51–77.
8. Nelson, Jelani. "Dimensionality Reduction." UC Berkeley lecture notes, August 1, 2022.
9. Silwal, Sandeep. "Beyond Worst-Case Dimensionality Reduction for Sparse Vectors." arXiv preprint, 2023.
10. Brass, Peter. *Research Problems in Discrete Geometry*. Springer, 2005.
11. Gilbert, Anna C., Martin J. Strauss, Joel A. Tropp, and Roman Vershynin. "One Sketch for All: Fast Algorithms for Compressed Sensing." In *Proceedings of the 39th Annual ACM Symposium on Theory of Computing*, 2007.
12. Deng, Chengyuan, Jie Gao, Kevin Lu, Feng Luo, and Cheng Xin. "Johnson–Lindenstrauss Lemma Beyond Euclidean Geometry." arXiv preprint arXiv:2310.22491, 2023.
13. Lim, Lek-Heng, Tetsuya Maehara, and Ken N. Smith. "Distortion Bounds for Spheres and the Borsuk–Ulam Frontier." Research manuscript, 2022.
14. Dubois, Michel, and Laurent Schwartz. "Lower Bounds on Metric Distortion over Spheres." *Annales de l'Institut Fourier* 31, no. 3 (1981): 1–33.
15. Burago, Dmitri, Yuri Burago, and Sergei Ivanov. *A Course in Metric Geometry*. American Mathematical Society, 2001.
16. Gromov, Mikhail. *Metric Structures for Riemannian and Non-Riemannian Spaces*. Birkhäuser, 1999.
17. Sturm, Karl-Theodor. "On the Geometry of Metric Measure Spaces." *Acta Mathematica* 196, no. 1 (2006): 65–131.
18. Mémoli, Facundo. "The Gromov–Hausdorff Distance: A Brief Tutorial on Some of Its Quantitative Aspects." *Actes des rencontres du C.I.R.M.* 3, no. 1 (2013): 89–96.
19. Popoff, Alexandre, Corentin Guichaoua, and Moreno Andreatta. "Composing (with) Automorphisms in the Colored Cube Dance: An Interactive Tool for Musical Chord Transformation." Manuscript, 2022.
