/** @docs-private */
export function createMissingDateImplError(provider) {
    return Error(`MtxDatetimepicker: No provider found for ${provider}. You must import one of the following ` +
        `modules at your application root: MtxNativeDatetimeModule, MtxMomentDatetimeModule, or provide a ` +
        `custom implementation.`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXItZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvZXh0ZW5zaW9ucy9kYXRldGltZXBpY2tlci9kYXRldGltZXBpY2tlci1lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxRQUFnQjtJQUN6RCxPQUFPLEtBQUssQ0FDViw0Q0FBNEMsUUFBUSx5Q0FBeUM7UUFDM0YsbUdBQW1HO1FBQ25HLHdCQUF3QixDQUMzQixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IocHJvdmlkZXI6IHN0cmluZykge1xuICByZXR1cm4gRXJyb3IoXG4gICAgYE10eERhdGV0aW1lcGlja2VyOiBObyBwcm92aWRlciBmb3VuZCBmb3IgJHtwcm92aWRlcn0uIFlvdSBtdXN0IGltcG9ydCBvbmUgb2YgdGhlIGZvbGxvd2luZyBgICtcbiAgICAgIGBtb2R1bGVzIGF0IHlvdXIgYXBwbGljYXRpb24gcm9vdDogTXR4TmF0aXZlRGF0ZXRpbWVNb2R1bGUsIE10eE1vbWVudERhdGV0aW1lTW9kdWxlLCBvciBwcm92aWRlIGEgYCArXG4gICAgICBgY3VzdG9tIGltcGxlbWVudGF0aW9uLmBcbiAgKTtcbn1cbiJdfQ==