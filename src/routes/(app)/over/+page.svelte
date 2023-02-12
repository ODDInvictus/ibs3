<script>
  const date = new Date()
</script>

<h1>Welkom bij Invictus Bier Systeem, dé website voor O.D.D. Invictus!</h1>

<p>
  Invictus Bier Systeem is ontwikkeld om de activiteiten, 
  strafbakken en financiële zaken van O.D.D. Invictus bij te houden. 
  Met deze website kun je eenvoudig informatie bijhouden en delen met andere leden van het dispuut.
</p>

<p>
  Onze website is gebouwd met TypeScript en SvelteKit, wat zorgt voor een snelle en efficiënte ervaring voor gebruikers. 
  De gebruiksvriendelijke interface maakt het gemakkelijk om activiteiten te plannen, 
  strafbakken bij te houden en financiële informatie te beheren.
</p>

<p>
  Met Invictus Bier Systeem kun je je concentreren op wat echt belangrijk is: 
  het vieren van leuke activiteiten en het versterken van de banden binnen het dispuut.
  Laat de administratieve taken achterwege en geniet van meer tijd samen met je dispuutgenoten. 
</p>

<p>
  Bedankt voor het kiezen van Invictus Bier Systeem! 
  Wij zijn er trots op deel uit te maken van de reis van O.D.D. Invictus.
</p>

<footer>
  <div>
    <p>
      Versie 3.0.0 <a href="https://github.com/ODDInvictus/ibs3/tree/54cc3c2efcc3dd27881cff9fa4634caaec14b205">(54cc3c2)</a>
    </p>
  </div>
</footer>

<style lang="scss">
  h1 {
    font-size: 2rem;
  }

  @media (min-width: 640px) {
    h1 {
      font-size: 2.5rem;
    }

    p {
      max-width: 50vw;
      margin-top: 1rem;
    }
  }

  footer {
    color: grey;
    font-size: 0.8rem;

    a:hover {
      color: blue;
    }
  }

</style>