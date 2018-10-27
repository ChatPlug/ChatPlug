export default interface IConfigWizard {
  /*
     * Ask the user for config of type T.
     */
  promptForConfig<T>(configType: { new (): T }): Promise<T>
}
