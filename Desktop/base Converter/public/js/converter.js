const inputs = {
  bin: document.getElementById('bin'),
  dec: document.getElementById('dec'),
  oct: document.getElementById('oct'),
  hex: document.getElementById('hex')
};

let activeBase = 'hex';

// Валидаторы для каждого формата
const validators = {
  bin: /^[01]*$/,
  dec: /^[0-9]*$/,
  oct: /^[0-7]*$/,
  hex: /^[0-9a-fA-F]*$/
};

// Возвращает основание системы счисления
function getBaseValue(key) {
  switch (key) {
    case 'bin': return 2;
    case 'oct': return 8;
    case 'dec': return 10;
    case 'hex': return 16;
  }
}

// Конвертация из активного формата во все остальные
function convertFrom(base, value) {
  if (!validators[base].test(value)) return;

  if (value === '') {
    // Очищаем только остальные поля
    for (const [key, input] of Object.entries(inputs)) {
      if (key !== base) input.value = '';
    }
    return;
  }

  const decimal = parseInt(value, getBaseValue(base));
  if (isNaN(decimal)) return;

  for (const [key, input] of Object.entries(inputs)) {
    if (key !== base) {
      input.value = decimal.toString(getBaseValue(key)).toUpperCase();
    }
  }
}

// Слушатели на ввод и фокус
for (const [key, input] of Object.entries(inputs)) {
  input.addEventListener('focus', () => {
    activeBase = key;
  });

  input.addEventListener('input', () => {
    const val = input.value.trim().toUpperCase();
    if (!validators[activeBase].test(val)) {
      input.value = val.replace(/./g, c => validators[activeBase].test(c) ? c : '');
      return;
    }
    convertFrom(activeBase, val);
  });
}

// Виртуальная клавиатура
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => {
    const val = key.textContent;

    if (val === 'AC') {
      inputs[activeBase].value = '';
      convertFrom(activeBase, '');
    } else if (val === '⌫') {
      inputs[activeBase].value = inputs[activeBase].value.slice(0, -1);
      convertFrom(activeBase, inputs[activeBase].value);
    } else {
      const newVal = (inputs[activeBase].value + val).toUpperCase();
      if (validators[activeBase].test(newVal)) {
        inputs[activeBase].value = newVal;
        convertFrom(activeBase, newVal);
      }
    }
  });
});
