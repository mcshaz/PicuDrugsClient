import { MethodLogic } from './../../PresentationClasses/Dosing/MethodLogic'
import { dilutionMethod } from './../../../db'
const methodLogics : ReadonlyArray<MethodLogic> = [
		new MethodLogic(true, false, false, false), 
		new MethodLogic(true, false, false, true), 
		new MethodLogic(false, false, false, false), 
		new MethodLogic(false, false, false, true), 
		new MethodLogic(false, true, true, true), 
		new MethodLogic(false, true, false, true), 
		new MethodLogic(false, false, true, true)
];

export function getDilutionMethod(method: dilutionMethod): MethodLogic
{
	return methodLogics[method - dilutionMethod.NeatFixedFlow];
}

