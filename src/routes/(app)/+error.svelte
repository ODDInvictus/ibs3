<script>
  import { page } from '$app/stores';
</script>

<div id="main">
  <h1><code>{$page?.error?.message}</code></h1>
  <p>
    Daar is toch echt wel iets flink mis gegaan. 
    Ik zou je een strafbak hiervoor geven maar helaas kan dat nog niet automatisch. 
    Geluksvogel.
  </p>
</div>


<style>
  #main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
  }
</style>