"use strict"

$(document).ready(function() {

	var s = {
		$form                         		 : $('form'),
		$wizardSidebarStepClasses     		 : 'wizard-sidebar-step-active wizard-sidebar-step-inactive wizard-sidebar-step-disabled',
		$currentVisibleModelFieldGroup 		 : $('div.model-input-group:nth-child(2)'),
		$modelFieldInputGroup              : $('div.model-input-group:first').clone(),
		$newModelFieldInputGroup           : null,
		$currentVisibleConstraintGroup 		 : $('div.constraint-input-group:nth-child(2)'),
		$constraintInputGroup         		 : $('div.constraint-input-group:first').clone(),
		$newConstraintInputGroup           : null
	}

	init()

	function init() {
		bindEvents()
	}

	function bindEvents() {
		bindAddModelFieldEvent()
		bindAddConstraintEvent()
	}

	function newModelFieldInputGroup() {
		var newModelFieldInputGroup = $(s.$modelFieldInputGroup).clone()
		// Iterate over the inputs of the file input group
		newModelFieldInputGroup.find(':input').not(':button').not("[aria-label='Search']").each(function() {
			if (this.id) {
				// Make input id's unique so Jquery Validate works correctly
				this.id = this.id + new Date().getTime()
			}
		})
		return newModelFieldInputGroup
	}

	function bindAddModelFieldEvent() {
		$('#clone').click(function(e) {
			e.preventDefault()
			// Only add new file inputs if the current form is valid
			if (s.$form.valid()) {
				// Create new file input group
				s.$newModelFieldInputGroup = newModelFieldInputGroup()
				// Append new file input group to DOM
				s.$newModelFieldInputGroup.appendTo('#model_fields').hide().fadeIn()
				// Hide other file input groups
				s.$newModelFieldInputGroup.siblings().hide()
				// Update the current visible input group
				s.$currentVisibleModelFieldGroup = s.$newModelFieldInputGroup
			}
		})
	}

	function newConstraintFieldInputGroup() {
		var newConstraintInputGroup = $(s.$constraintInputGroup).clone()
		// Iterate over the inputs of the file input group
		newConstraintInputGroup.find(':input').not(':button').not("[aria-label='Search']").each(function() {
			if (this.id) {
				// Make input id's unique so Jquery Validate works correctly
				this.id = this.id + new Date().getTime()
			}
		})
		return newConstraintInputGroup
	}

	function bindAddConstraintEvent() {
		$('#clone-constraint').click(function(e) {
			e.preventDefault()
			// Only add new file inputs if the current form is valid
			if (s.$form.valid()) {
				// Create new file input group
				s.$newConstraintInputGroup = newConstraintFieldInputGroup()
				// Append new file input group to DOM
				s.$newConstraintInputGroup.appendTo('#constraint_fields').hide().fadeIn()
				// Hide other file input groups
				s.$newConstraintInputGroup.siblings().hide()
				// Update the current visible input group
				s.$currentVisibleConstraintGroup = s.$newConstraintInputGroup
			}
		})
	}

	// ###################################### Validation Code ######################################

	// Initialise Jquery Validate on form
	var validator = s.$form.validate({
		rules: { // Validation rules (inputs are identified by name attribute)
			'model[name]': { required: true },
			'model[description]': { required: true },
			'model[license]': { required: true },
			'model_schema_fields[][name]': { required: true },
			'model_schema_fields[][description]': { required: true },
			'model_schema_fields[][type]': { required: true }
		},
		onfocusout: function(element) {
			this.element(element) // Validate elements on onfocusout
		}
	})

	var formSteps = ['step-one', 'step-two', 'step-three']
  var currentStep = formSteps[0]

	$.each(formSteps, function(i, targetStep) {
		var targetStepButton = '.show-' + targetStep

		$(document).on('click', targetStepButton, function (e) {
			if (stepsValid(stepsToValidate(targetStep))) {
				hideStep(currentStep)
				showStep(targetStep)
				if (currentStep === formSteps[0] || currentStep === formSteps[1]) {
					hideStepDescription(currentStep)
				}
				currentStep = targetStep
			}
			e.preventDefault()
		})
	})

	function hideStepDescription(step) {
		getWizardSidebarStep(step).find('.wizard-sidebar-step-description').hide()
	}

	// Get the steps that require validation inbetween currentStep and targetStep
	// Accepts string e.g. 'step-three'
	// Returns array of steps e.g. ['step-one', 'step-two']
	function stepsToValidate(targetStep) {
		return formSteps.slice(formSteps.indexOf(currentStep), formSteps.indexOf(targetStep))
	}

	// Returns true if all passed-in steps are valid, false otherwise
	// Accepts array of strings e.g. ['step-one', 'step-two']
	function stepsValid(steps) {
		if (!steps.length) { return true }

		// This builds an array of booleans, each one representing the validity of a step
		// Then it sums the booleans to get the total validity of the steps
		return steps.map(function(step) {
			return stepValid(step)
		}).reduce(function(sum, bool) {
			return sum && bool
		})
	}

	// Return true if step is valid, false otherwise
	// Accepts string e.g. 'step-one'
	function stepValid(step) {
		// .valid() is a JQuery Validate function
		return stepInputs('#' + step).valid()
	}

	// Return the inputs for a step as a JQuery Object
	// Accepts string e.g. '#step-one'
	function stepInputs(step) {
		// Return all step inputs except buttons and search boxes for dropdowns
		return $(step).find(':input').not(':button').not("[aria-label='Search']")
	}

	function hideStep(step) {
		$('#' + step).addClass('hidden')
		deactivateSidebarStep(step)
	}

	function showStep(step) {
		$('#' + step).show().removeClass('hidden')
		$.each(stepsToValidate(step), function(i, s) { hideStep(s) })
		activateSidebarStep(step)
	}

	function deactivateSidebarStep(step) {
		getWizardSidebarStep(step)
			.removeClass(s.$wizardSidebarStepClasses)
			.addClass('wizard-sidebar-step-inactive')
	}

	function activateSidebarStep(step) {
		getWizardSidebarStep(step)
			.removeClass(s.$wizardSidebarStepClasses)
			.addClass('wizard-sidebar-step-active')
	}

	function getWizardSidebarStep(step) {
		return $('.show-' + step).parents('.wizard-sidebar-step')
	}

})