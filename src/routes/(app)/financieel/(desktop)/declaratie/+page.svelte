<script lang="ts">
  import type { PageData, ActionData } from './$types';

  export let form: ActionData;

  let productData = {
    product: form?.product ?? '',
    prijs: form?.prijs ?? 0,
    statiegeld: form?.statiegeld ?? 0,
    methode: form?.methode ?? 'Eigen rekening'
  }

  let files: FileList | null = null

  $: if (files) {
    showImage()
  }

  function showImage() {
    const receipt = document.getElementById('receipt')! as HTMLInputElement
    const image   = document.getElementById('receipt-image')! as HTMLImageElement

    if (receipt) {
      const fileList = receipt.files

      if (!fileList || fileList.length === 0) return

      const file = fileList[0]

      const reader = new FileReader()

      reader.onload = function (e) {
        // @ts-expect-error Is gewoon string niet piepen
        image.src = e.target?.result ?? ''
      }

      reader.readAsDataURL(file)
    }
  }

</script>

<h1>Doe een declaratie</h1>
<p>Heb je bier gekocht, of wil je gewoon geld van ons? Doe dan een declaratie!</p>

{#if form?.success}
  <p class="success">{form.message ?? ''}</p>
{/if}

{#if !form?.success}
  <p class="error">{form?.message ?? ''}</p>
{/if}

<form method="POST" enctype="multipart/form-data">

  <label for="product">Wat heb je gekocht</label>
  <input type="text" name="product" id="product" bind:value={productData.product}>

  <label for="methode">Betaalmethode</label>
  <input type="text" name="methode" id="methode" bind:value={productData.methode}>

  <label for="statiegeld">Prijs</label>
  <span class="input-euro">
    <input type="number" class="euro" min="0.00" step=".01" name="prijs" id="prijs" bind:value={productData.prijs}>
  </span>

  <label for="statiegeld">Statiegeld</label>
  <span class="input-euro">
    <input type="number" class="euro" min="0.00" step=".01" name="statiegeld" id="statiegeld" bind:value={productData.statiegeld}>
  </span>

  <label for="receipt">Bon</label>
  <input type="file" name="receipt" id="receipt" bind:files>
  
  <button
    type="submit"
    class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center transition">
    Verstuur
  </button>

</form>

<img src="" id="receipt-image" alt="Hier komt je bonnetje te staan" />

<style lang="scss">
  .error {
    color: red;
  }

  .success {
    color: purple;
  }

  h1 {
    font-size: 1.5rem;
  }

  form {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 1rem;

    label {
      font-weight: 600;
      padding-top: 0.4rem;
    }

    button {
      margin-bottom: 1rem;
    }

    input:not([type="file"]) {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      outline: none;
    }

    input[type="file"] {
      outline: none;
      cursor: pointer;
    }

    input:focus:not([type="file"]) {
      border: 1px solid purple;
    }

    .euro {
      padding-left: 22px !important;
    }
  }

  .input-euro {
    position: relative;
  }

  .input-euro:before {
    position: absolute;
    content:"€";
    top: 9px;
    left: 9px;
  }

</style>