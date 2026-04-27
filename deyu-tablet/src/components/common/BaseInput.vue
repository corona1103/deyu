<script setup lang="ts">
interface Props {
  modelValue: string
  type?: 'text' | 'tel' | 'password' | 'number'
  placeholder?: string
  disabled?: boolean
  maxlength?: number
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
}>()
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :maxlength="maxlength"
    class="base-input"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.base-input {
  width: 100%;
  height: 50px;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  padding: 0 16px;
  font-size: 16px;
  color: $gray-800;
  background: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: $primary;
  }

  &:disabled {
    background: $gray-50;
    color: $gray-400;
    cursor: not-allowed;
  }

  &::placeholder {
    color: $gray-400;
  }

  @media (min-width: $breakpoint-md) {
    height: 55px;
  }
}
</style>
