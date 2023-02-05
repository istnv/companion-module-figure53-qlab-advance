import { combineRgb } from '@companion-module/base'
import * as Choices from './choices.js'

export function compileFeedbackDefinitions(self) {
	return {
		playhead_bg: {
			type: 'advanced',
			name: 'Playhead Color for Background',
			description: 'Use the QLab color for the Playhead (next) cue as background',
			options: [],
			callback: (feedback, context) => {
				const nc = self.wsCues[self.nextCue] ? self.wsCues[self.nextCue].qColor : 0
				return { bgcolor: nc }
			},
		},
		run_bg: {
			type: 'advanced',
			name: 'Running Que color for Background',
			description: 'Use the QLab color of the running cue as background',
			options: [],
			callback: (feedback, context) => {
				return { bgcolor: self.runningCue.qColor }
			},
		},
		q_bg: {
			type: 'advanced',
			name: 'Cue Number color for background',
			description: 'Use the QLab color of the specified cue number as background',
			options: [
				{
					type: 'textinput',
					label: 'Cue Number',
					id: 'cue',
					default: '',
				},
			],
			callback: (feedback, context) => {
				const bg = self.cueColors[feedback.options.cue.replace(/[^\w\.]/gi, '_')]
				return { bgcolor: bg || 0 }
			},
		},
		qid_bg: {
			type: 'advanced',
			name: 'Cue ID color for background',
			description: 'Use the QLab color of the specified cue ID as background',
			options: [
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cueId',
					default: self.nextCue,
				},
			],
			callback: (feedback, context) => {
				const tc = self.wsCues[feedback.options.cueId]
				const bg = tc && tc.qColor
				return { bgcolor: bg || 0 }
			},
		},
		q_run: {
			type: 'boolean',
			name: 'Indicate Cue is running',
			description: 'Indicate on button when the specified cue is running',
			options: [
				{
					type: 'textinput',
					label: 'Cue Number',
					id: 'cue',
					default: '',
				},
			],
			defaultStyle: {
				bgcolor: combineRgb(102, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			callback: (feedback, context) => {
				const opt = feedback.options
				const rqID = self.cueByNum[opt.cue.replace(/[^\w\.]/gi, '_')]
				const rq = self.wsCues[rqID]
				return rq && rq.isRunning
			},
		},
		qid_run: {
			type: 'boolean',
			name: 'Indicate Cue ID is running',
			description: 'Indicate on button when cue ID is running',
			options: [
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cueID',
					default: self.nextCue,
				},
			],
			defaultStyle: {
				bgcolor: combineRgb(204, 0, 204),
				color: combineRgb(255, 255, 255),
			},
			callback: (feedback, context) => {
				const opt = feedback.options
				// const rqID = self.cueByNum[opt.cue.replace(/[^\w\.]/gi,'_')];
				const rq = self.wsCues[opt.cueID]
				return rq && rq.isRunning
			},
		},
		min_go: {
			type: 'boolean',
			name: 'Indicate Go button Status',
			description: 'Indicate on Button the QLab Go button Status',
			options: [
				{
					type: 'dropdown',
					label: 'Status?',
					id: 'goMode',
					default: '1',
					choices: [
						{ id: '0', label: 'Disabled' },
						{ id: '1', label: 'Enabled' },
					],
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 102, 0),
			},
			callback: (feedback, context) => {
				const options = feedback.options

				if (self.goDisabled && options.goMode == '0') {
					return true
				} else if (options.goMode == '1') {
					return true
				} else {
					return false
				}
			},
		},
		ws_mode: {
			type: 'boolean',
			name: 'Indicate Workspace Mode',
			description: 'Indicate on Button QLab Show/Edit/Audition Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Which Mode?',
					id: 'showMode',
					default: '1',
					choices: [
						{ id: '0', label: 'Edit' },
						{ id: '1', label: 'Show' },
						{ id: '2', label: 'Audition' },
					],
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 128, 0),
			},
			callback: (feedback, context) => {
				const options = feedback.options

				if (self.auditMode && options.showMode == '2') {
					return true
				} else if (self.showMode && options.showMode == '1') {
					return true
				} else if (!self.showMode && options.showMode == '0') {
					return true
				} else {
					return false
				}
			},
		},
		override: {
			type: 'boolean',
			name: 'Master Override',
			description: 'Set Button when Override is Active',
			options: [
				{
					type: 'dropdown',
					label: 'Override',
					id: 'which',
					default: Choices.OVERRIDE[0].id,
					choices: Choices.OVERRIDE,
				},
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(102, 0, 0),
			},
			callback: (feedback, context) => {
				const options = feedback.options

				return !self.overrides[options.which]
			},
		},
		override_visible: {
			type: 'boolean',
			name: 'Override Window Visible',
			description: 'Set Button when Override Window is visible',
			options: [
				// {
				// 	type: 'dropdown',
				// 	label: 'Override',
				// 	id: 'which',
				// 	default: 1,
				// 	choices: Choices.ON_OFF,
				// },
			],
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(102, 0, 0),
			},
			callback: (feedback, context) => {
				const options = feedback.options

				return self.overrideWindow == 1
			},
		},
	}
}
