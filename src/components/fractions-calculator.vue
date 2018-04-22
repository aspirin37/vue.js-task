<template>
  <div class="calculator container d-flex flex-column">
    <div class="d-flex flex-wrap">
      <div class="d-flex flex-row align-items-center" v-for="(fraction, i) in fractions">
        <select class="calculator__element form-control form-control-sm" v-model="fraction.operator" @change="countFractions" v-if="i">
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
      <span class="calculator__element calculator__equals-sign align-self-center">
        <span v-if="decimalAnswer < 0 && decimalAnswer > -1">-</span>
        <span v-if="decimalAnswer >= 1 || decimalAnswer <= -1 || decimalAnswer == 0">{{ Math.trunc(decimalAnswer) }}</span>
      </span>

      <div class="calculator__element calculator__element--answer" v-if="answer.numerator % answer.denominator">
        <div class="calculator__answer calculator__answer--numerator">{{ Math.abs(answer.numerator % answer.denominator) }}</div>
        <div class="calculator__answer">{{ Math.abs(answer.denominator) }}</div>
      </div>
    </div>

    <div class="calculator__error-message text-left text-danger">{{ errorMessage }}</div>
    <div class="text-left">
      <span class="calculator__button text-dark" @click.prevent="addFraction">ADD FRACTION</span>
      <span class="calculator__button text-dark" @click.prevent="setToDefault">RESET</span>
    </div>
  </div>
</template>

<script>
import Fraction from 'fractions'
import lodash from 'lodash'

export default {
  name: 'FractionsCalculator',
  components: {
    Fraction,
    lodash,
  },
  data () {
    return {
      DEFAULT_FRACTIONS: [{
        operator: '+',
        numerator: 1,
        denominator: 1,
        simpleFraction: '',
        intermediateResult: ''
      }, {
        operator: '+',
        numerator: 1,
        denominator: 1,
        simpleFraction: '',
        intermediateResult: '',
      }],
      operators: ['+', '-', '*', '/'],
      errorMessage: '',
      fractions: [],
      answer: {},
      copy: [],
      toCountAgain: false,
      isMinusZero: false,
      decimalAnswer: 0,
      toCountAgainCopy: []
    }
  },
  methods: {
    countFractions () {
      try {
        const isNextHighPriorityOperation = (fraction, i, fractions) => {
          return fractions[i + 1] && (fractions[i + 1].operator === '*' || fractions[i + 1].operator === '/') ? true : false
        }

        const changeOperationsPriority = (fraction, i, fractions) => {
          fraction.intermediateResult = new Fraction(fraction.simpleFraction)
          fractions[i + 1].toSkip = true
        }

        const getAnswer = (intermediateResult) => {
          const answerObject = new Fraction(intermediateResult)
          this.answer.numerator = answerObject.numerator
          this.answer.denominator = answerObject.denominator
          this.decimalAnswer = answerObject.numerator / answerObject.denominator
        }

        this.copy = lodash.cloneDeep(this.fractions)
        this.toCountAgain = false

        this.copy.forEach((it, i, arr) => {
          it.simpleFraction = it.numerator + '/' + it.denominator
          if (i == 0) {
            if (isNextHighPriorityOperation(it, i, arr)) {
              changeOperationsPriority(it, i, arr)
              return
            }
            it.intermediateResult = it.simpleFraction
          } else {
            switch (it.operator) {
              case '+':
              if (isNextHighPriorityOperation(it, i, arr)) {
                changeOperationsPriority(it, i, arr)
                this.toCountAgain = true
                return
              }
              it.intermediateResult = new Fraction(Fraction.add(arr[i - 1].intermediateResult, it.simpleFraction))
              break
              case '-':
              if (isNextHighPriorityOperation(it, i, arr)) {
                changeOperationsPriority(it, i, arr)
                this.toCountAgain = true
                return
              }
              it.intermediateResult = new Fraction(Fraction.subtract(arr[i - 1].intermediateResult, it.simpleFraction))
              break
              case '*':
              it.intermediateResult = new Fraction(Fraction.multiply(arr[i - 1].intermediateResult, it.simpleFraction))
              break
              case '/':
              it.intermediateResult = new Fraction(Fraction.divide(arr[i - 1].intermediateResult, it.simpleFraction))
              break
            }
            getAnswer(it.intermediateResult)
          }
        })

        if (this.toCountAgain) {
          let result
          this.toCountAgainCopy = lodash.cloneDeep(this.copy).filter((it) => !it.toSkip)

          this.toCountAgainCopy.forEach((it, i, arr) => {
            it.simpleFraction = it.numerator + '/' + it.denominator
            if (i) {
              switch (it.operator) {
                case '+':
                result = new Fraction(Fraction.add(lodash.cloneDeep(arr[i - 1].intermediateResult), it.intermediateResult))
                break
                case '-':
                result = new Fraction(Fraction.subtract(lodash.cloneDeep(arr[i - 1].intermediateResult), it.intermediateResult))
                break
              }
              getAnswer(result)
            }
          })
        }
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
    setToDefault () {
      this.fractions = lodash.cloneDeep(this.DEFAULT_FRACTIONS)
      this.countFractions()
    },
  },
  created () {
    this.setToDefault()
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

  .calculator__button
    width: 130px
    margin-right: 10px
    text-decoration: underline
    cursor: pointer

</style>
