<script>
  import { page } from '$app/stores';
</script>

<h1>Oei!</h1>
<p>
  Daar is toch echt wel iets flink mis gegaan. Ik zou je een strafbak hiervoor geven maar helaas kan dat nog niet automatisch. Geluksvogel.
</p>
<p>
  Hier is de foutmelding:
  <code>{$page.error.message}</code>
</p>