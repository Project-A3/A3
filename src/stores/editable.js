import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export const useEditableStore = defineStore('editable', {
  state: () => ({
    editableFields: {},
    editableGroups: [],
    currentEditableGroup: ''
  }),
  getters: {},
  actions: {
    refreshGroup(id, isEditing = false) {
      try {
        let fields = document.getElementById(id).querySelectorAll('[data-editing-type]');
        let currentGroup = this.editableGroups.find((e) => e.id === id);
        currentGroup.elements = [];
        for (const field of fields) {
          currentGroup.elements.push(field.id);
          this.editableFields[field.id] = isEditing;
        }
      } catch (e) {
        console.error(e);
        throw '刷新群組失敗';
      }
    },
    closeCurrentGroupEditing() {
      // 關掉其他群組
      if (this.currentEditableGroup) {
        let gc = this.editableGroups.find((e) => e.id === this.currentEditableGroup);
        console.log(gc);
        for (const field of gc.elements) {
          this.editableFields[field] = false;
        }
      }
    }
  }
});
