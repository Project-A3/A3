<script setup>
import { storeToRefs } from 'pinia';
import { useLanguageStore } from '../stores/language';

const props = defineProps({
    code: {
        type: String,
        required: true
    },
    values: {
        type: Array,
        default: []
    }
});
const parse = () => {
    let result = languages.value[props.code];
    if(result === undefined) {
        return `[${language.value}] ${props.code}`;
    }
    
    return props.values.reduce((rs, value, index) => rs.replace(new RegExp(`\\[${index}\\]`, 'g'), value), result);
};
const { language, languages } = storeToRefs(useLanguageStore());
</script>
<template>
    <slot v-if="$slots.translate"
        name="translate"
        :text="parse()" />
    <slot v-else>{{ parse() }}</slot>
</template>