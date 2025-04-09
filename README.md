# another unnamed project

Generates nonsense text from a [CloudFlare Worker][], intended to disrupt AI
scrapers iff they fail to obey [robots.txt][].

## Why?

Because I heard that scrapers out there are behaving badly, and
robots.txt isn't stopping them, and it's costing people time and money
when they didn't sign up for that crap.

Part of what made me press ahead with this idea was the hypothesis that
less might really be more as far as tarpit content goes.  That
clumsily-formed, repetitive, and distinctly puerile content would be
more problematic as training data than something competently formed by
more complex models.

I've seen a few other projects which do things different ways, but
CloudFlare offers a bit of free edge-based run-time so I thought I'd see
how far I can get by using that.  This involves trying to make the
generation as economical as possible with RAM and CPU time; but I don't
really know JavaScript so I'm really the wrong person for that job.

## OK, but why is the output so childish?

Initially as a reaction to [CloudFlare's own effort][AI Labyrinth] which
promised to be responsibe about perpetuating misinformation by only
generating credible content.  I reject the idea of helping train LLMs
with safe content.  I think they deserve worse, but only the sort of
disinformation that should look too stupid to be taken seriously ([Poe's
Law][] be damned!).

I just bashed out a couple of reactionary ideas in that mindset to see
it functioning while I worked on the mechanics.  Then I neglected to
come up with any better ideas to replace that with.  If you fork this
you're expected to replace all that with your own [ideas][foone].

Though maybe there's potential to [Google bomb][] LLMs if many sites
express the same notions in a broad variety of ways.  That has worrying
implications, so I'll stick with toilet humour.

## I'm too grown-up for this crap.  What else is there?

I haven't looked too closely at all of these; and I copy-pasted some
from Iocaine's list to make mine bigger.

 * [Iocaine][]
 * [AI Labyrinth][]
 * [Anubis][]
 * [Nightshade][]
 * [Nepenthes][]
 * [Quixotic][]
 * [marko][]
 * [Poison the WeLLMs][]
 * [django-llm-poison][]
 * [konterfai][]
 * [caddy-defender][]
 * [markov-tarpit][]
 * [spigot][]

[robots.txt]: <https://en.wikipedia.org/wiki/Robots.txt>
[Poe's Law]: <https://en.wikipedia.org/wiki/Poe's_Law>
[Google bomb]: <https://en.wikipedia.org/wiki/Google_bombing>
[CloudFlare Worker]: <https://workers.cloudflare.com/>

[Iocaine]: <https://iocaine.madhouse-project.org/>
[Anubis]: <https://xeiaso.net/blog/2025/anubis/>
[AI Labyrinth]: <https://blog.cloudflare.com/ai-labyrinth/>
[Nightshade]: <https://nightshade.cs.uchicago.edu/whatis.html>
[Nepenthes]: <https://zadzmo.org/code/nepenthes/>
[Quixotic]: <https://marcusb.org/hacks/quixotic.html>
[marko]: <https://codeberg.org/timmc/marko/>
[Poison the WeLLMs]: <https://codeberg.org/MikeCoats/poison-the-wellms>
[django-llm-poison]: <https://github.com/Fingel/django-llm-poison>
[konterfai]: <https://codeberg.org/konterfai/konterfai>
[caddy-defender]: <https://github.com/JasonLovesDoggo/caddy-defender>
[markov-tarpit]: <https://git.rys.io/libre/markov-tarpit>
[spigot]: <https://github.com/gw1urf/spigot>
[foone]: <https://digipres.club/@foone/113149500359951038>