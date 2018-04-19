<template>
  <div class="container d-flex justify-content-center">
    <form class="calculator d-flex flex-row align-items-center">

      <div class="calculator__element">
        <div class="input-group">
          <input class="calculator__number form-control form-control-sm" type="number" required step="1">
        </div>
        <div class="input-group">
          <input class="calculator__number form-control form-control-sm" type="number" required step="1">
        </div>
      </div>

      <select class="calculator__element form-control form-control-sm" v-model="selectedOperant">
        <option v-for="operant in operants" :value="operant">{{ operant }}</option>
      </select>

      <div class="calculator__element">
        <div class="input-group">
          <input class="calculator__number form-control form-control-sm" type="number" required step="1">
        </div>
        <div class="input-group">
          <input class="calculator__number form-control form-control-sm" type="number" required step="1">
        </div>
      </div>

      <button class="calculator__element btn btn-primary" type="sumbit" @submit.prevent="">Равно</button>

      <div class="result" id="resultDr">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'FractionsCalculator',
  data () {
    return {
      operants: ['+', '-', '*', '/'],
      selectedOperant: '+'
    }
  }
}
</script>

<style scoped lang="sass">
  .calculator__number
    width: 80px
    margin-bottom: 7px

  .calculator__element
    margin-right: 15px

</style>
