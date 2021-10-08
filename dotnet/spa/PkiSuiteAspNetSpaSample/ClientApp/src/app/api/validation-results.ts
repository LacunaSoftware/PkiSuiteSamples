export interface ValidationResultsModel {
  passedChecks: ValidationItemModel[],
  errors: ValidationItemModel[], 
  warnings: ValidationItemModel[],
  isValid: boolean,
}

export interface ValidationItemModel {
  type: string,
  message: string,
  detail: string,
  innerValidationResults: ValidationResultsModel,
}
