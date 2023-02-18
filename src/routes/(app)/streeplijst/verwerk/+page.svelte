
<div id="root">
  <h1>Verwerk een streeplijst</h1>

</div>

<div id="screen-warning">
  <h1>Verwerk een streeplijst</h1>
  <p>Deze pagina is alleen beschikbaar op een desktop scherm.</p>
  <p>Mocht je dit wel voor mobiel willen, is er zeker wel een plekje voor je vrij in de bakkentrekkers ;)</p>
</div>

<style>
  #root {
    display: block;
  }

  #screen-warning {
    display: none;
  }

  @media (min-width: 640px) {
    #root {
      display: none;
    }

    #screen-warning {
      display: block;
    }
  }
</style>