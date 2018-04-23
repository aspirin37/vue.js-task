<template>
  <div class="calculator container d-flex flex-column">
    <form class="d-flex flex-wrap" @submit.prevent>
      <div class="d-flex flex-row align-items-center" v-for="(fraction, i) in fractions">
        <select class="calculator__element form-control form-control-sm" v-model="fraction.operator" @change="countFractions" v-if="i">
          <option v-for="operator in OPERATORS" :value="operator">{{ operator }}</option>
        </select>
        <div class="calculator__element">
          <div class="input-group">
            <the-mask mask="#######" class="calculator__number form-control form-control-sm" v-model="fraction.numerator" @input="countFractions"/>
          </div>
          <div class="input-group">
            <the-mask mask="#######" class="calculator__number form-control form-control-sm" v-model="fraction.denominator" @input="countFractions"/>
          </div>
        </div>
      </div>

      <span class="calculator__element calculator__equals-sign align-self-center">=</span>
      <span class="calculator__element calculator__equals-sign align-self-center" v-if="!errorMessage">
        <span v-if="decimalAnswer < 0 && decimalAnswer > -1">-</span>
        <span v-if="decimalAnswer >= 1 || decimalAnswer <= -1 || decimalAnswer == 0">{{ Math.trunc(decimalAnswer) }}</span>
      </span>

      <div class="calculator__element calculator__element--answer" v-if="!errorMessage && answerRemainder">
        <div class="calculator__answer calculator__answer--numerator">{{ Math.abs(answerRemainder) }}</div>
        <div class="calculator__answer">{{ Math.abs(answer.denominator) }}</div>
      </div>
    </form>

    <div class="calculator__error-message text-left text-danger">{{ errorMessage }}</div>
    <div class="text-left">
      <span class="calculator__button text-dark" @click.prevent="addFraction">ADD FRACTION</span>
      <span class="calculator__button text-dark" @click.prevent="setFractionsToDefault">RESET</span>
      <router-link :to="{ path: 'web-sockets' }" class="calculator__button text-dark">
        TO WEB-SOCKETS
      </router-link>
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
    lodash
  },
  data () {
    return {
      OPERATORS: ['+', '-', '*', '/'],
      DEFAULT_FRACTIONS: [{
        operator: '+',
        numerator: 1,
        denominator: 1,
      }, {
        operator: '+',
        numerator: 1,
        denominator: 1,
      }],
      fractions: [],
      answer: {
        numerator: 0,
        denominator: 0
      },
      decimalAnswer: 0,
      answerRemainder: 0,
      errorMessage: '',
    }
  },
  methods: {
    countFractions (evt) {
      try {
        const fractionsCopy = lodash.cloneDeep(this.fractions)

        /**
         * Функция принимает на вход строку с простой дробью, на основании которой высчитывает поля, необходимые для отрисовки ответа
         * @param  {string}
         */
        const getAnswer = (result) => {
          const answerObject = new Fraction(result)
          this.answer.numerator = answerObject.numerator
          this.answer.denominator = answerObject.denominator
          this.decimalAnswer = answerObject.numerator / answerObject.denominator
          this.answerRemainder = answerObject.numerator % answerObject.denominator
        }

        fractionsCopy.forEach((it, i, arr) => {
          it.simpleFraction = it.numerator + '/' + it.denominator
        })

        // Если следующий оператор является умножением или делением, запоминаем промежуточный результат в одном объекте, а остальные объекты отмечаем на удаление. Затем передаем в наш объект знак предшествующий операции (плюс или минус)
        fractionsCopy.forEach((it, i, arr) => {
          if (arr[i + 1] && (arr[i + 1].operator === '*' || arr[i + 1].operator === '/')) {
            let newFractionObject
            switch (arr[i + 1].operator) {
              case '*':
              newFractionObject = Fraction.multiply(it.intermediateResult || it.simpleFraction, arr[i + 1].simpleFraction)
              break
              case '/':
              newFractionObject = Fraction.divide(it.intermediateResult || it.simpleFraction, arr[i + 1].simpleFraction)
              break
            }
            arr[i + 1].intermediateResult = newFractionObject.numerator + '/' + newFractionObject.denominator
            arr[i + 1].intermediateOperator = it.intermediateOperator || it.operator
            it.toSkip = true
          }
        })

        // Заменяем значения дробей и их знаки на промежуточные результаты
        fractionsCopy.forEach((it) => {
          if (it.intermediateOperator) {
            it.operator = it.intermediateOperator
            it.simpleFraction = it.intermediateResult
          }
        })

        // Избавляемся от отмеченных на удаление дробей
        const newFractions = lodash.cloneDeep(fractionsCopy).filter((it) => !it.toSkip)

        // Если нужно, складываем, вычитаем
        newFractions.forEach((it, i, arr) => {
          if (arr[i - 1]) {
            let newFractionObject
            switch (it.operator) {
              case '+':
              newFractionObject = Fraction.add(arr[i - 1].intermediateResult || arr[i - 1].simpleFraction, it.simpleFraction)
              break
              case '-':
              newFractionObject = Fraction.subtract(arr[i - 1].intermediateResult || arr[i - 1].simpleFraction, it.simpleFraction)
              break
            }
            it.intermediateResult = newFractionObject.numerator + '/' + newFractionObject.denominator
          }

          if (arr.length > 1 && i == arr.length - 1) {
            getAnswer(it.intermediateResult)
            return
          }
          getAnswer(it.simpleFraction)
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
      })
      this.countFractions()
    },
    setFractionsToDefault () {
      this.fractions = lodash.cloneDeep(this.DEFAULT_FRACTIONS)
      this.countFractions()
    },
  },
  created () {
    this.setFractionsToDefault()
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
