import ExpoModulesCore

public class ExpoSystemThemeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSystemTheme")

    Function("getTheme") { () -> String? in
      nil
    }
  }
}
