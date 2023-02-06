import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { assert, deprecate, runInDebug } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { getOwnConfig, macroCondition } from '@embroider/macros';
import {
  formatDate,
  toIsoDateString,
  isIsoDateString,
} from '@appuniversum/ember-appuniversum/utils/date';

const DEFAULT_ADAPTER = {
  parse: function (value = '', createDate) {
    let dateRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;

    const matches = value.match(dateRegex);
    if (matches) {
      return createDate(matches[3], matches[2], matches[1]);
    }
  },
  format: formatDate,
};

const DEFAULT_LOCALIZATION = {
  dayNames: getLocalizedDays(),
  monthNames: getLocalizedMonths(),
  monthNamesShort: getLocalizedMonths('short'),
};

if (macroCondition(getOwnConfig().dutchDatePickerLocalization)) {
  Object.assign(DEFAULT_LOCALIZATION, {
    buttonLabel: 'Kies een datum',
    placeholder: 'DD-MM-JJJJ',
    selectedDateMessage: 'De geselecteerde datum is',
    prevMonthLabel: 'Vorige maand',
    nextMonthLabel: 'Volgende maand',
    monthSelectLabel: 'Maand',
    yearSelectLabel: 'Jaar',
    closeLabel: 'Sluit venster',
    keyboardInstruction: 'Gebruik de pijltjestoetsen om te navigeren',
    calendarHeading: 'Kies een datum',
  });
} else {
  Object.assign(DEFAULT_LOCALIZATION, {
    buttonLabel: 'Choose date',
    placeholder: 'DD-MM-YYYY',
    selectedDateMessage: 'Selected date is',
    prevMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    monthSelectLabel: 'Month',
    yearSelectLabel: 'Year',
    closeLabel: 'Close window',
    keyboardInstruction: 'You can use arrow keys to navigate dates',
    calendarHeading: 'Choose a date',
  });
}

export default class AuDatePickerComponent extends Component {
  @asIsoDate value;
  @asIsoDate min;
  @asIsoDate max;
  @tracked isInitialized = false;

  constructor() {
    super(...arguments);
    this.registerDuetDatePicker();

    let isNewImplementation = macroCondition(
      getOwnConfig().dutchDatePickerLocalization
    )
      ? true
      : false;

    deprecate(
      `[AuDatePicker] The English localization is deprecated. You should explicitly enable the Dutch localization by adding a build-time flag to your ember-cli-build.js file:

      \`\`\`
      // ember-cli-build.js
      '@appuniversum/ember-appuniversum': {
        dutchDatePickerLocalization: true,
      },
      \`\`\`

      Note: This only changes the default localization of the component. You can still provide custom @adapter and @localization arguments if needed.
      `,
      isNewImplementation,
      {
        id: '@appuniversum/ember-appuniversum.au-date-picker.english-localization',
        until: '3.0.0',
        for: '@appuniversum/ember-appuniversum',
        since: {
          enabled: '1.9.0',
        },
      }
    );
  }

  get adapter() {
    if (!this.args.adapter) {
      return DEFAULT_ADAPTER;
    }

    runInDebug(() => validateAdapter(this.args.adapter));

    return {
      ...DEFAULT_ADAPTER,
      ...this.args.adapter,
    };
  }

  get id() {
    return this.args.id ? this.args.id : guidFor(this);
  }

  get localization() {
    if (!this.args.localization) {
      return DEFAULT_LOCALIZATION;
    }

    runInDebug(() => validateLocalization(this.args.localization));

    return {
      ...DEFAULT_LOCALIZATION,
      ...this.args.localization,
    };
  }

  get error() {
    if (this.args.error) return 'duet-date-error';
    if (this.args.warning) return 'duet-date-warning';
    else return '';
  }

  get alignment() {
    if (this.args.alignment == 'top') return 'au-c-datepicker--top';
    else return '';
  }

  @action
  handleDuetDateChange(event) {
    let wasDatePickerCleared = !event.detail.value;
    if (wasDatePickerCleared) {
      this.args.onChange?.(null, null);
    } else {
      this.args.onChange?.(event.detail.value, event.detail.valueAsDate);
    }
  }

  async registerDuetDatePicker() {
    if (typeof FastBoot === 'undefined') {
      const { defineCustomElements: registerDuetDatePicker } = await import(
        '@duetds/date-picker/custom-element'
      );
      registerDuetDatePicker();
      this.isInitialized = true;
    }
  }
}

function validateAdapter(adapterArg) {
  assert(
    `The @adapter argument needs to be an object but it is a "${typeof adapterArg}"`,
    Boolean(adapterArg) && typeof adapterArg === 'object'
  );

  Object.keys(adapterArg).map((key) => {
    assert(
      `"${key}" is not a property of adapter, maybe it is just a typo?`,
      key in DEFAULT_ADAPTER
    );
  });
}

function validateLocalization(localizationArg) {
  assert(
    `The @localization argument needs to be an object but it is a "${typeof localizationArg}"`,
    Boolean(localizationArg) && typeof localizationArg === 'object'
  );

  Object.keys(localizationArg).map((key) => {
    assert(
      `"${key}" is not a property of localization, maybe it is just a typo?`,
      key in DEFAULT_LOCALIZATION
    );
  });
}

function asIsoDate(target, key /*, descriptor */) {
  return {
    get() {
      let argValue = this.args[key];

      if (!argValue) {
        return;
      }

      assert(
        `@${key} should be a string or a Date instance but it is a "${typeof argValue}"`,
        typeof argValue === 'string' || argValue instanceof Date
      );

      if (argValue instanceof Date) {
        return toIsoDateString(argValue);
      } else {
        assert(
          `@${key} ("${argValue}") should be a valid ISO 8601 formatted date`,
          isIsoDateString(argValue)
        );
        return argValue;
      }
    },
  };
}

function getLocalizedMonths(monthFormat = 'long') {
  let someYear = 2021;
  return [...Array(12).keys()].map((monthIndex) => {
    let date = new Date(someYear, monthIndex);
    return intl({ month: monthFormat }).format(date);
  });
}

function getLocalizedDays(weekdayFormat = 'long') {
  let someSunday = new Date('2021-01-03');
  return [...Array(7).keys()].map((index) => {
    let weekday = new Date(someSunday.getTime());
    weekday.setDate(someSunday.getDate() + index);
    return intl({ weekday: weekdayFormat }).format(weekday);
  });
}

function intl(options) {
  let locale = macroCondition(getOwnConfig().dutchDatePickerLocalization)
    ? 'nl-BE'
    : 'en';

  return new Intl.DateTimeFormat(locale, options);
}
