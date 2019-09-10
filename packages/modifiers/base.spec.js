import test from '@interactjs/_dev/test/test';
import * as helpers from '@interactjs/core/tests/_helpers';
import * as utils from '@interactjs/utils';
import modifiersBase from './base';
test('modifiers/base', t => {
    const { scope, target, interaction, interactable, } = helpers.testEnv({ plugins: [modifiersBase] });
    scope.actions.eventTypes.push('TESTstart', 'TESTmove', 'TESTend');
    t.ok(utils.is.object(interaction.modifiers), 'modifiers prop is added new Interaction');
    const element = target;
    const startEvent = {
        pageX: 100,
        pageY: 200,
        clientX: 100,
        clientY: 200,
        target: element,
    };
    const moveEvent = {
        pageX: 400,
        pageY: 500,
        clientX: 400,
        clientY: 500,
        target: element,
    };
    const options = { target: { x: 100, y: 100 }, setStart: true };
    let firedEvents = [];
    interactable.rectChecker(() => ({ top: 0, left: 0, bottom: 50, right: 50 }));
    interactable.on('TESTstart TESTmove TESTend', event => firedEvents.push(event));
    interaction.pointerDown(startEvent, startEvent, element);
    interactable.options.TEST = {
        enabled: true,
        modifiers: [
            {
                options,
                methods: targetModifier,
            },
        ],
    };
    interaction.start({ name: 'TEST' }, interactable, element);
    t.ok(options.started, 'modifier methods.start() was called');
    t.ok(options.setted, 'modifier methods.set() was called');
    t.deepEqual(interaction.prevEvent.page, options.target, 'start event coords are modified');
    t.deepEqual(interaction.coords.start.page, { x: 100, y: 200 }, 'interaction.coords.start are restored after action start phase');
    t.deepEqual(interaction.coords.cur.page, { x: 100, y: 200 }, 'interaction.coords.cur are restored after action start phase');
    interaction.pointerMove(moveEvent, moveEvent, element);
    t.deepEqual(interaction.coords.cur.page, { x: moveEvent.pageX, y: moveEvent.pageY }, 'interaction.coords.cur are restored after action move phase');
    t.deepEqual(interaction.coords.start.page, { x: startEvent.pageX, y: startEvent.pageY }, 'interaction.coords.start are restored after action move phase');
    t.deepEqual({ x: interaction.prevEvent.x0, y: interaction.prevEvent.y0 }, { x: 100, y: 100 }, 'move event start coords are modified');
    firedEvents = [];
    const similarMoveEvent = { ...moveEvent, pageX: moveEvent.pageX + 0.5 };
    interaction.pointerMove(similarMoveEvent, similarMoveEvent, element);
    t.equal(firedEvents.length, 0, 'duplicate result coords are ignored');
    interaction.stop();
    t.ok(options.stopped, 'modifier methods.stop() was called');
    // don't set start
    options.setStart = null;
    interactable.options.TEST.modifiers.push({
        options,
        methods: doubleModifier,
    });
    interaction.pointerDown(startEvent, startEvent, element);
    interaction.start({ name: 'TEST' }, interactable, element);
    t.notOk(options.setted, 'modifier methods.set() was not called on start phase without options.setStart');
    t.deepEqual(interaction.prevEvent.page, { x: 100, y: 200 }, 'start event coords are not modified without options.setStart');
    t.deepEqual(interaction.coords.start.page, { x: 100, y: 200 }, 'interaction.coords.start are not modified without options.setStart');
    interaction.pointerMove(moveEvent, moveEvent, element);
    t.deepEqual(interaction.prevEvent.page, { x: 200, y: 200 }, 'move event coords are modified by all modifiers');
    interaction.pointerMove(moveEvent, moveEvent, element);
    t.doesNotThrow(() => {
        interaction._signals.fire('action-resume', {
            interaction,
        });
    }, 'action-resume doesn\'t throw errors');
    interaction.stop();
    t.end();
});
const targetModifier = {
    start({ state }) {
        state.options.started = true;
    },
    set({ state, coords }) {
        const { target } = state.options;
        coords.x = target.x;
        coords.y = target.y;
        state.options.setted = true;
    },
    stop({ state }) {
        state.options.stopped = true;
        delete state.options.started;
        delete state.options.setted;
    },
};
const doubleModifier = {
    start() { },
    set({ coords }) {
        coords.x *= 2;
        coords.y *= 2;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLDRCQUE0QixDQUFBO0FBQzdDLE9BQU8sS0FBSyxPQUFPLE1BQU0saUNBQWlDLENBQUE7QUFDMUQsT0FBTyxLQUFLLEtBQUssTUFBTSxtQkFBbUIsQ0FBQTtBQUMxQyxPQUFPLGFBQWEsTUFBTSxRQUFRLENBQUE7QUFFbEMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ3pCLE1BQU0sRUFDSixLQUFLLEVBQ0wsTUFBTSxFQUNOLFdBQVcsRUFDWCxZQUFZLEdBQ2IsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRWpELEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0lBRWpFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLHlDQUF5QyxDQUFDLENBQUE7SUFFdkYsTUFBTSxPQUFPLEdBQUcsTUFBMEIsQ0FBQTtJQUMxQyxNQUFNLFVBQVUsR0FBRztRQUNqQixLQUFLLEVBQUUsR0FBRztRQUNWLEtBQUssRUFBRSxHQUFHO1FBQ1YsT0FBTyxFQUFFLEdBQUc7UUFDWixPQUFPLEVBQUUsR0FBRztRQUNaLE1BQU0sRUFBRSxPQUFPO0tBQ1QsQ0FBQTtJQUNSLE1BQU0sU0FBUyxHQUFHO1FBQ2hCLEtBQUssRUFBRSxHQUFHO1FBQ1YsS0FBSyxFQUFFLEdBQUc7UUFDVixPQUFPLEVBQUUsR0FBRztRQUNaLE9BQU8sRUFBRSxHQUFHO1FBQ1osTUFBTSxFQUFFLE9BQU87S0FDVCxDQUFBO0lBQ1IsTUFBTSxPQUFPLEdB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T0FBTyxDQUFDLE1BQU0sQ0FBQTtJQUM3QixDQUFDO0NBQ0YsQ0FBQTtBQUVELE1BQU0sY0FBYyxHQUFHO0lBQ3JCLEtBQUssS0FBSyxDQUFDO0lBQ1gsR0FBRyxDQUFFLEVBQUUsTUFBTSxFQUFFO1FBQ2IsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDYixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNmLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnQGludGVyYWN0anMvX2Rldi90ZXN0L3Rlc3QnXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJ0BpbnRlcmFjdGpzL2NvcmUvdGVzdHMvX2hlbHBlcnMnXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICdAaW50ZXJhY3Rqcy91dGlscydcbmltcG9ydCBtb2RpZmllcnNCYXNlIGZyb20gJy4vYmFzZSdcblxudGVzdCgnbW9kaWZpZXJzL2Jhc2UnLCB0ID0+IHtcbiAgY29uc3Qge1xuICAgIHNjb3BlLFxuICAgIHRhcmdldCxcbiAgICBpbnRlcmFjdGlvbixcbiAgICBpbnRlcmFjdGFibGUsXG4gIH0gPSBoZWxwZXJzLnRlc3RFbnYoeyBwbHVnaW5zOiBbbW9kaWZpZXJzQmFzZV0gfSlcblxuICBzY29wZS5hY3Rpb25zLmV2ZW50VHlwZXMucHVzaCgnVEVTVHN0YXJ0JywgJ1RFU1Rtb3ZlJywgJ1RFU1RlbmQnKVxuXG4gIHQub2sodXRpbHMuaXMub2JqZWN0KGludGVyYWN0aW9uLm1vZGlmaWVycyksICdtb2RpZmllcnMgcHJvcCBpcyBhZGRlZCBuZXcgSW50ZXJhY3Rpb24nKVxuXG4gIGNvbnN0IGVsZW1lbnQgPSB0YXJnZXQgYXMgSW50ZXJhY3QuRWxlbWVudFxuICBjb25zdCBzdGFydEV2ZW50ID0ge1xuICAgIHBhZ2VYOiAxMDAsXG4gICAgcGFnZVk6IDIwMCxcbiAgICBjbGllbnRYOiAxMDAsXG4gICAgY2xpZW50WTogMjAwLFxuICAgIHRhcmdldDogZWxlbWVudCxcbiAgfSBhcyBhbnlcbiAgY29uc3QgbW92ZUV2ZW50ID0ge1xuICAgIHBhZ2VYOiA0MDAsXG4gICAgcGFnZVk6IDUwMCxcbiAgICBjbGllbnRYOiA0MDAsXG4gICAgY2xpZW50WTogNTAwLFxuICAgIHRhcmdldDogZWxlbWVudCxcbiAgfSBhcyBhbnlcbiAgY29uc3Qgb3B0aW9uczogYW55ID0geyB0YXJnZXQ6IHsgeDogMTAwLCB5OiAxMDAgfSwgc2V0U3RhcnQ6IHRydWUgfVxuICBsZXQgZmlyZWRFdmVudHMgPSBbXVxuXG4gIGludGVyYWN0YWJsZS5yZWN0Q2hlY2tlcigoKSA9PiAoeyB0b3A6IDAsIGxlZnQ6IDAsIGJvdHRvbTogNTAsIHJpZ2h0OiA1MCB9KSlcbiAgaW50ZXJhY3RhYmxlLm9uKCdURVNUc3RhcnQgVEVTVG1vdmUgVEVTVGVuZCcsIGV2ZW50ID0+IGZpcmVkRXZlbnRzLnB1c2goZXZlbnQpKVxuICBpbnRlcmFjdGlvbi5wb2ludGVyRG93bihzdGFydEV2ZW50LCBzdGFydEV2ZW50LCBlbGVtZW50KVxuXG4gIDsoaW50ZXJhY3RhYmxlLm9wdGlvbnMgYXMgYW55KS5URVNUID0ge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgbW9kaWZpZXJzOiBbXG4gICAgICB7XG4gICAgICAgIG9wdGlvbnMsXG4gICAgICAgIG1ldGhvZHM6IHRhcmdldE1vZGlmaWVyLFxuICAgICAgfSxcbiAgICBdLFxuICB9XG5cbiAgaW50ZXJhY3Rpb24uc3RhcnQoeyBuYW1lOiAnVEVTVCcgfSwgaW50ZXJhY3RhYmxlLCBlbGVtZW50KVxuXG4gIHQub2soXG4gICAgb3B0aW9ucy5zdGFydGVkLFxuICAgICdtb2RpZmllciBtZXRob2RzLnN0YXJ0KCkgd2FzIGNhbGxlZCcsXG4gIClcblxuICB0Lm9rKFxuICAgIG9wdGlvbnMuc2V0dGVkLFxuICAgICdtb2RpZmllciBtZXRob2RzLnNldCgpIHdhcyBjYWxsZWQnLFxuICApXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgaW50ZXJhY3Rpb24ucHJldkV2ZW50LnBhZ2UsXG4gICAgb3B0aW9ucy50YXJnZXQsXG4gICAgJ3N0YXJ0IGV2ZW50IGNvb3JkcyBhcmUgbW9kaWZpZWQnKVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5wYWdlLFxuICAgIHsgeDogMTAwLCB5OiAyMDAgfSxcbiAgICAnaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0IGFyZSByZXN0b3JlZCBhZnRlciBhY3Rpb24gc3RhcnQgcGhhc2UnKVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLmNvb3Jkcy5jdXIucGFnZSxcbiAgICB7IHg6IDEwMCwgeTogMjAwIH0sXG4gICAgJ2ludGVyYWN0aW9uLmNvb3Jkcy5jdXIgYXJlIHJlc3RvcmVkIGFmdGVyIGFjdGlvbiBzdGFydCBwaGFzZScpXG5cbiAgaW50ZXJhY3Rpb24ucG9pbnRlck1vdmUobW92ZUV2ZW50LCBtb3ZlRXZlbnQsIGVsZW1lbnQpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLmN1ci5wYWdlLFxuICAgIHsgeDogbW92ZUV2ZW50LnBhZ2VYLCB5OiBtb3ZlRXZlbnQucGFnZVkgfSxcbiAgICAnaW50ZXJhY3Rpb24uY29vcmRzLmN1ciBhcmUgcmVzdG9yZWQgYWZ0ZXIgYWN0aW9uIG1vdmUgcGhhc2UnKVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5wYWdlLFxuICAgIHsgeDogc3RhcnRFdmVudC5wYWdlWCwgeTogc3RhcnRFdmVudC5wYWdlWSB9LFxuICAgICdpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQgYXJlIHJlc3RvcmVkIGFmdGVyIGFjdGlvbiBtb3ZlIHBoYXNlJylcblxuICB0LmRlZXBFcXVhbChcbiAgICB7IHg6IGludGVyYWN0aW9uLnByZXZFdmVudC54MCwgeTogaW50ZXJhY3Rpb24ucHJldkV2ZW50LnkwIH0sXG4gICAgeyB4OiAxMDAsIHk6IDEwMCB9LFxuICAgICdtb3ZlIGV2ZW50IHN0YXJ0IGNvb3JkcyBhcmUgbW9kaWZpZWQnKVxuXG4gIGZpcmVkRXZlbnRzID0gW11cbiAgY29uc3Qgc2ltaWxhck1vdmVFdmVudCA9IHsgLi4ubW92ZUV2ZW50LCBwYWdlWDogbW92ZUV2ZW50LnBhZ2VYICsgMC41IH1cbiAgaW50ZXJhY3Rpb24ucG9pbnRlck1vdmUoc2ltaWxhck1vdmVFdmVudCwgc2ltaWxhck1vdmVFdmVudCwgZWxlbWVudClcbiAgdC5lcXVhbChmaXJlZEV2ZW50cy5sZW5ndGgsIDAsICdkdXBsaWNhdGUgcmVzdWx0IGNvb3JkcyBhcmUgaWdub3JlZCcpXG5cbiAgaW50ZXJhY3Rpb24uc3RvcCgpXG5cbiAgdC5vayhcbiAgICBvcHRpb25zLnN0b3BwZWQsXG4gICAgJ21vZGlmaWVyIG1ldGhvZHMuc3RvcCgpIHdhcyBjYWxsZWQnLFxuICApXG5cbiAgLy8gZG9uJ3Qgc2V0IHN0YXJ0XG4gIG9wdGlvbnMuc2V0U3RhcnQgPSBudWxsXG4gIC8vIGFkZCBzZWNvbmQgbW9kaWZpZXJcbiAgOyhpbnRlcmFjdGFibGUub3B0aW9ucyBhcyBhbnkpLlRFU1QubW9kaWZpZXJzLnB1c2goe1xuICAgIG9wdGlvbnMsXG4gICAgbWV0aG9kczogZG91YmxlTW9kaWZpZXIsXG4gIH0pXG5cbiAgaW50ZXJhY3Rpb24ucG9pbnRlckRvd24oc3RhcnRFdmVudCwgc3RhcnRFdmVudCwgZWxlbWVudClcbiAgaW50ZXJhY3Rpb24uc3RhcnQoeyBuYW1lOiAnVEVTVCcgfSwgaW50ZXJhY3RhYmxlLCBlbGVtZW50KVxuXG4gIHQubm90T2soXG4gICAgb3B0aW9ucy5zZXR0ZWQsXG4gICAgJ21vZGlmaWVyIG1ldGhvZHMuc2V0KCkgd2FzIG5vdCBjYWxsZWQgb24gc3RhcnQgcGhhc2Ugd2l0aG91dCBvcHRpb25zLnNldFN0YXJ0JyxcbiAgKVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLnByZXZFdmVudC5wYWdlLFxuICAgIHsgeDogMTAwLCB5OiAyMDAgfSxcbiAgICAnc3RhcnQgZXZlbnQgY29vcmRzIGFyZSBub3QgbW9kaWZpZWQgd2l0aG91dCBvcHRpb25zLnNldFN0YXJ0JylcblxuICB0LmRlZXBFcXVhbChcbiAgICBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQucGFnZSxcbiAgICB7IHg6IDEwMCwgeTogMjAwIH0sXG4gICAgJ2ludGVyYWN0aW9uLmNvb3Jkcy5zdGFydCBhcmUgbm90IG1vZGlmaWVkIHdpdGhvdXQgb3B0aW9ucy5zZXRTdGFydCcpXG5cbiAgaW50ZXJhY3Rpb24ucG9pbnRlck1vdmUobW92ZUV2ZW50LCBtb3ZlRXZlbnQsIGVsZW1lbnQpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgaW50ZXJhY3Rpb24ucHJldkV2ZW50LnBhZ2UsXG4gICAgeyB4OiAyMDAsIHk6IDIwMCB9LFxuICAgICdtb3ZlIGV2ZW50IGNvb3JkcyBhcmUgbW9kaWZpZWQgYnkgYWxsIG1vZGlmaWVycycpXG5cbiAgaW50ZXJhY3Rpb24ucG9pbnRlck1vdmUobW92ZUV2ZW50LCBtb3ZlRXZlbnQsIGVsZW1lbnQpXG5cbiAgdC5kb2VzTm90VGhyb3coKCkgPT4ge1xuICAgIGludGVyYWN0aW9uLl9zaWduYWxzLmZpcmUoJ2FjdGlvbi1yZXN1bWUnLCB7XG4gICAgICBpbnRlcmFjdGlvbixcbiAgICB9KVxuICB9LCAnYWN0aW9uLXJlc3VtZSBkb2VzblxcJ3QgdGhyb3cgZXJyb3JzJylcblxuICBpbnRlcmFjdGlvbi5zdG9wKClcblxuICB0LmVuZCgpXG59KVxuXG5jb25zdCB0YXJnZXRNb2RpZmllciA9IHtcbiAgc3RhcnQgKHsgc3RhdGUgfSkge1xuICAgIHN0YXRlLm9wdGlvbnMuc3RhcnRlZCA9IHRydWVcbiAgfSxcbiAgc2V0ICh7IHN0YXRlLCBjb29yZHMgfSkge1xuICAgIGNvbnN0IHsgdGFyZ2V0IH0gPSBzdGF0ZS5vcHRpb25zXG5cbiAgICBjb29yZHMueCA9IHRhcmdldC54XG4gICAgY29vcmRzLnkgPSB0YXJnZXQueVxuXG4gICAgc3RhdGUub3B0aW9ucy5zZXR0ZWQgPSB0cnVlXG4gIH0sXG4gIHN0b3AgKHsgc3RhdGUgfSkge1xuICAgIHN0YXRlLm9wdGlvbnMuc3RvcHBlZCA9IHRydWVcbiAgICBkZWxldGUgc3RhdGUub3B0aW9ucy5zdGFydGVkXG4gICAgZGVsZXRlIHN0YXRlLm9wdGlvbnMuc2V0dGVkXG4gIH0sXG59XG5cbmNvbnN0IGRvdWJsZU1vZGlmaWVyID0ge1xuICBzdGFydCAoKSB7fSxcbiAgc2V0ICh7IGNvb3JkcyB9KSB7XG4gICAgY29vcmRzLnggKj0gMlxuICAgIGNvb3Jkcy55ICo9IDJcbiAgfSxcbn1cbiJdfQ==