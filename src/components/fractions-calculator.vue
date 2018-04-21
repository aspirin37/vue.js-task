<template>
  <div class="calculator container d-flex flex-column">
    <div class="d-flex flex-wrap">
      <div class="fraction d-flex flex-row align-items-center" v-for="fraction in fractions">
        <select class="calculator__element form-control form-control-sm" v-model="fraction.operator" @change="countFractions" v-if="fraction.operator">
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
    <div class="calculator__error-message text-left text-danger">{{ errorMessage }}</div>
    <a class="calculator__add-fraction text-left text-dark" href='#' @click.prevent="addFraction"><u>ADD FRACTION</u></a>
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
      errorMessage: '',
      fractions: [{
        numerator: 1,
        denominator: 1,
        simpleFraction: '',
      }, {
        operator: '+',
        numerator: 1,
        denominator: 1,
        simpleFraction: '',
        intermediateResult: ''
      }],
      answer: {
        numerator: 2,
        denominator: 1,
        simpleFraction: '',
      }
    }
  },
  methods: {
    countFractions () {
      try {
        this.fractions.forEach((it, i) => {
          it.simpleFraction = it.numerator + '/' + it.denominator

          if (it.operator) {
            switch (it.operator) {
              case '*':
              it.intermediateResult = Fraction.multiply(this.fractions[i - 1].intermediateResult || this.fractions[i - 1].simpleFraction, it.simpleFraction)
              break
              case '/':
              it.intermediateResult = Fraction.divide(this.fractions[i - 1].intermediateResult || this.fractions[i - 1].simpleFraction, it.simpleFraction)
              break
              case '+':
              it.intermediateResult = Fraction.add(this.fractions[i - 1].intermediateResult || this.fractions[i - 1].simpleFraction, it.simpleFraction)
              break
              case '-':
              it.intermediateResult = Fraction.subtract(this.fractions[i - 1].intermediateResult || this.fractions[i - 1].simpleFraction, it.simpleFraction)
              break
            }

            const answerObject = new Fraction(it.intermediateResult)
            this.answer.numerator = answerObject.numerator
            this.answer.denominator = answerObject.denominator
          }
        })
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = 'Can not divide by zero!'
      }
    },
    addFraction () {
      this.fractions.push({
        operator: '+',
        numerator: 1,
        denominator: 1,
        simpleFraction: '',
      })
      this.countFractions()
    },
  }
}
</script>

<style scoped lang="sass">
  .calculator
    padding-left: 400px

  .calculator__number
    width: 80px
    margin-bottom: 7px

  .calculator__element
    margin-right: 15px

  .calculator__answer,
  .calculator__equals-sign
    font-size: 24px
    line-height: 1.7

    &--numerator
      border-bottom: 2px solid #2c3e50

  .calculator__error-message
    min-height: 25px

  .calculator__add-fraction
    width: 130px

</style>
