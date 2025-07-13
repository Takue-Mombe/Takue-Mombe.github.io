<script>
	import './style/components/contact.css';
	import Topnav from "./home/topnav.svelte";
	import Hero from "./home/hero.svelte";
	import About from "./home/about.svelte";
	import Project from "./home/project.svelte";
	import Contact from "./home/contact.svelte";
	import Gitroll from "./home/gitroll.svelte";
	import Separator from "./home/separator.svelte";
</script>

<Topnav/>
<Hero />
<Separator text="FEATURED STORY CONTINUES" />
<About />
<Separator text="SPECIAL PROJECT COVERAGE" />
<Project />
<Separator text="DEVELOPER METRICS & ANALYSIS" />
<Gitroll />
<Separator text="CORRESPONDENCE SECTION" />
<Contact />
