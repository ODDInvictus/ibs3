<script lang="ts">
  import { page } from '$app/stores'

  function formatPrice(price: number) {
    return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
  }
</script>

<h1>Financieel</h1>

<p>Huidig saldo: {formatPrice($page.data.person.balance)}</p>

<p>Je hebt de volgende opties: </p>

<a href="/financieel/transacties/">Transacties</a>
<a href="/financieel/streeplijst/verwerk">Verwerk streeplijst</a>
<a href="/financieel/transacties/verkopen">Verkopen</a>
<a href="/financieel/declaratie">Doe een declaratie</a>
<a href="/financieel/declaratie/overzicht">Declaratie overzicht</a>

<style>

  h1 {
    font-size: 1.5rem;
  }
  a {
    margin: 1rem 0;
    display: block;
    width: fit-content;
  }
  
  a:hover {
    text-decoration: underline;
  }
</style>