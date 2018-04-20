<template>
  <div class="container d-flex justify-content-center">

    <div class="fraction d-flex flex-row align-items-center" v-for="(fraction, i) in fractions">
      <select class="calculator__element form-control form-control-sm" v-model="fraction.operator" @input="countFractions" v-if="fraction.operator">
        <option v-for="operator in operators" :value="operator">{{ operator }}</option>
      </select>
      <div class="calculator__element">
        <div class="input-group">
          <input class="calculator__number form-control form-control-sm" type="number" step="1" v-model="fraction.numerator" @input="countFractions">
        </div>
        <div class="input-group">
          <input class="calculator__number form-control form-control-sm" type="number" step="1" v-model="fraction.denominator" @input="countFractions">
        </div>
      </div>
    </div>

    <span class="calculator__element calculator__equals-sign align-self-center">=</span>

    <div class="calculator__element calculator__element--answer">
      <div class="calculator__answer calculator__answer--numerator">{{ answer.numerator }}</div>
      <div class="calculator__answer">{{ answer.denominator }}</div>
    </div>
  </div>
</template>

<script>
import Fraction from 'fractions'
export default {
  name: 'FractionsCalculator',
  components: {
    Fraction
  },
  data () {
    return {
      operators: ['+', '-', '*', '/'],
      fractions: [{
        numerator: 1,
        denominator: 1,
        simpleFraction: '',
      }, {
        operator: '+',
        numerator: 2,
        denominator: 2,
        simpleFraction: '',
      }],
      answer: {
        numerator: 1,
        denominator: 1,
      }
    }
  },
  methods: {
    // // Наибольший общий делитель
    // getGreatestCommonDivisor (n, m) {
    //   if (m > 0) {
    //     const k = n % m;
    //     return this.getGreatestCommonDivisor(m, k);
    //   }
    //   return Math.abs(n);
    // },
    // // Наименьшее общее кратное
    // getLeastCommonMultiple (x, y) {
    //   return (x / this.getGreatestCommonDivisor(x, y) | 0) * y;
    // },
    // // Дополнительны
    // countAdditionalMultiple () {
    //   this.getLeastCommonMultiple(this.leftPart.denominator, this.rightPart.denominator))
    // }
    // validateDenominator (evt) {
    //   evt.target.value === '0' || evt.target.value === '-0'? evt.target.setCustomValidity('Ноль в знаменателе?') : evt.target.setCustomValidity('')
    //   document.querySelector('#calculator-submit-btn').click()
    // }
    countFractions () {
      this.fractions.forEach((it) => {
        it.simpleFraction = it.numerator + '/' + it.denominator
      })
      // console.log(new Fraction(this.fractions[0].numerator + '/' + this.fractions[0].denominator))
    }
  }
}
</script>

<style scoped lang="sass">
  .form-control-sm

  .calculator__number
    width: 80px
    margin-bottom: 7px

  .calculator__element
    position: relative
    margin-right: 15px

    &--answer


  .calculator__answer,
  .calculator__equals-sign
    font-size: 24px
    line-height: 1.7

    &--numerator
      border-bottom: 2px solid #2c3e50

</style>
