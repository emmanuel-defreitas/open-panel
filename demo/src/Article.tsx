import { useScrollFade } from "./useScrollFade";

export function Article() {
  const contentRef = useScrollFade();
  return (
    <article
      ref={contentRef}
      className="sample-article"
      aria-label="A slower way through the woods"
      tabIndex={0}
    >
      <header>
        <p className="article-kicker">Field notes · Issue 01</p>
        <h1>A slower way through the woods</h1>
        <p className="article-deck">
          An afternoon without a destination, and a few things worth noticing along the way.
        </p>
        <p className="article-meta">Sample story · 5 minute read</p>
      </header>
      <figure>
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"
          width="1200"
          height="800"
          alt="Sunlight filtering through a green forest canopy"
        />
        <figcaption>Light finds its way through the canopy. Photograph via Unsplash.</figcaption>
      </figure>
      <p>
        The path began where the road ended. There was no grand entrance, just a gap between two trees and a
        wooden sign that had weathered to almost the same color as their bark. Beyond it, the ground was soft
        with last season’s leaves. We put our phones away and stepped into the shade.
      </p>
      <p>
        At first, we walked as if there were somewhere to get to. That is a surprisingly difficult habit to
        leave behind. Our strides were long, our eyes stayed on the trail, and every bend seemed to promise
        the part of the afternoon we had come for.
      </p>
      <h2>Learning to look again</h2>
      <p>
        Then a small patch of sunlight stopped us. It fell across a fern at the edge of the path, turning the
        thin leaves almost transparent. Nothing else had changed. The woods were still the woods, and the
        trail continued around the corner. But for a moment, there was no reason to hurry.
      </p>
      <p>
        Once we started looking, the details multiplied. A fallen branch held a miniature garden of moss.
        Rainwater sat in a hollow between roots. A spider had drawn a line across a space we would otherwise
        have called empty. The place was full of things that could only be seen at walking speed, or slower.
      </p>
      <blockquote>There was no particular view to reach. The walk itself was enough.</blockquote>
      <h2>The sound of the in-between</h2>
      <p>
        Farther in, the road became inaudible. We could hear the dry click of a twig underfoot and the
        different sounds made by wind in different trees. Somewhere above us, a bird repeated a short phrase.
        Another answered from a direction we could not quite locate.
      </p>
      <p>
        We sat on a log and opened the lunch we had packed in a hurry. The bread was a little flattened. The
        apples were cold. It felt like a better meal than anything we might have planned. For ten minutes, the
        only decision was whether to stay a little longer.
      </p>
      <figure>
        <img
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80"
          width="1200"
          height="800"
          loading="lazy"
          alt="A still mountain lake reflecting the landscape and sky"
        />
        <figcaption>A quiet stretch of water beyond the trees. Photograph via Unsplash.</figcaption>
      </figure>
      <h2>Taking the longer way home</h2>
      <p>
        At a fork in the trail, we chose the branch that curved toward the water. The trees thinned, and the
        light became broad and even. Along the bank, small stones showed through the shallows. Out in the
        middle, the surface reflected a sky we had almost forgotten was there.
      </p>
      <p>
        We stayed until the air began to cool. There was no photograph that seemed likely to explain the
        afternoon, though we took a few anyway. Most of what mattered was outside the frame: the temperature,
        the smell of damp earth, the relief of having nothing to finish.
      </p>
      <h2>A few things to bring</h2>
      <ul>
        <li>Water, something simple to eat, and a light extra layer.</li>
        <li>Shoes you do not mind getting muddy.</li>
        <li>A small notebook for a thought, a sketch, or the name of a place.</li>
        <li>Enough time to stop without watching the clock.</li>
      </ul>
      <p>
        On the way back, the same path looked different. We recognized the fern, the crooked tree, and the
        stretch where the ground dipped. Familiarity had arrived quietly. By the time we reached the sign, it
        felt less like leaving a place than returning from a conversation.
      </p>
      <h2>What stays with you</h2>
      <p>
        Later, when someone asked what we had done, the answer was almost embarrassingly short. We had gone
        for a walk. We had eaten lunch. We had sat beside the water. There was no accomplishment to attach to
        the story, and no distance worth mentioning.
      </p>
      <p>
        Yet the afternoon stayed with us. A little of its pace followed us into the evening: washing a cup,
        opening a window, listening before answering. Perhaps that was the point of going. Not to collect a
        remarkable experience, but to notice an ordinary one while it was happening.
      </p>
      <footer className="article-end">End of the story · You’ve reached the bottom.</footer>
    </article>
  );
}
