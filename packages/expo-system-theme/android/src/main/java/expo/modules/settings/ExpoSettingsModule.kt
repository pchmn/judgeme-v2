package expo.modules.settings

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.os.Build
import android.content.res.Resources
import android.util.Log
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*

class ExpoSettingsModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoSettings")

        Function("getTheme") {
            return@Function getDynamicColorPalette("theme")
        }
    }

    private val context
        get() = requireNotNull(appContext.reactContext)

    private fun getDynamicColorPalette(name: String): WritableMap? {
        Log.d("DynamicColorModule", "Create event called with name: $name and.")

        val currentSdk = Build.VERSION.SDK_INT
        val minSdk = Build.VERSION_CODES.S

        // Dynamic colors are only available on Android S and up.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val resources = this.getApplicationResources()

            if (resources == null) {
                Log.w("DynamicColorModule", "could not get resources for dynamic color module")
                return null
            }

            return this.getCorePalette(resources)
        } else {
            Log.w("DynamicColorModule", "SDK version $minSdk is required to run this native module, got $currentSdk")
            return null
        }
    }

    private fun getApplicationResources(): Resources? {
        if (context == null) {
            Log.d("DynamicColorModule", "React context was null, could not get resource list")
            return null
        }

        if (context.resources == null) {
            Log.d("DynamicColorModule", "React context resources was null, could not get resource list")
            return null
        }
        return context.resources
    }

    @RequiresApi(Build.VERSION_CODES.S)
    private fun getCorePalette(resources: Resources): WritableMap {
        fun getColor(key: Int): String {
            val hex = resources.getColor(key, null)
            return String.format("#%06X", 0xFFFFFF and hex)
        }

        val originPalettes = mapOf(
                "primary" to setOf(
                        android.R.color.system_accent1_1000,
                        android.R.color.system_accent1_900,
                        android.R.color.system_accent1_800,
                        android.R.color.system_accent1_700,
                        android.R.color.system_accent1_600,
                        android.R.color.system_accent1_500,
                        android.R.color.system_accent1_400,
                        android.R.color.system_accent1_300,
                        android.R.color.system_accent1_200,
                        android.R.color.system_accent1_100,
                        android.R.color.system_accent1_50,
                        android.R.color.system_accent1_10,
                        android.R.color.system_accent1_0,
                ),
                "secondary" to setOf(
                        android.R.color.system_accent2_1000,
                        android.R.color.system_accent2_900,
                        android.R.color.system_accent2_800,
                        android.R.color.system_accent2_700,
                        android.R.color.system_accent2_600,
                        android.R.color.system_accent2_500,
                        android.R.color.system_accent2_400,
                        android.R.color.system_accent2_300,
                        android.R.color.system_accent2_200,
                        android.R.color.system_accent2_100,
                        android.R.color.system_accent2_50,
                        android.R.color.system_accent2_10,
                        android.R.color.system_accent2_0,
                ),
                "tertiary" to setOf(
                        android.R.color.system_accent3_1000,
                        android.R.color.system_accent3_900,
                        android.R.color.system_accent3_800,
                        android.R.color.system_accent3_700,
                        android.R.color.system_accent3_600,
                        android.R.color.system_accent3_500,
                        android.R.color.system_accent3_400,
                        android.R.color.system_accent3_300,
                        android.R.color.system_accent3_200,
                        android.R.color.system_accent3_100,
                        android.R.color.system_accent3_50,
                        android.R.color.system_accent3_10,
                        android.R.color.system_accent3_0,
                ),
                "neutral_1" to setOf(
                        android.R.color.system_accent3_1000,
                        android.R.color.system_accent3_900,
                        android.R.color.system_accent3_800,
                        android.R.color.system_accent3_700,
                        android.R.color.system_accent3_600,
                        android.R.color.system_accent3_500,
                        android.R.color.system_accent3_400,
                        android.R.color.system_accent3_300,
                        android.R.color.system_accent3_200,
                        android.R.color.system_accent3_100,
                        android.R.color.system_accent3_50,
                        android.R.color.system_accent3_10,
                        android.R.color.system_accent3_0,
                ),
                "neutral_2" to setOf(
                        android.R.color.system_neutral2_1000,
                        android.R.color.system_neutral2_900,
                        android.R.color.system_neutral2_800,
                        android.R.color.system_neutral2_700,
                        android.R.color.system_neutral2_600,
                        android.R.color.system_neutral2_500,
                        android.R.color.system_neutral2_400,
                        android.R.color.system_neutral2_300,
                        android.R.color.system_neutral2_200,
                        android.R.color.system_neutral2_100,
                        android.R.color.system_neutral2_50,
                        android.R.color.system_neutral2_10,
                        android.R.color.system_neutral2_0,
                )
        )

        val targetPalettes = mapOf(
                "primary" to mutableListOf<String>(),
                "secondary" to mutableListOf<String>(),
                "tertiary" to mutableListOf<String>(),
                "neutral_1" to mutableListOf<String>(),
                "neutral_2" to mutableListOf<String>(),
        )

        for (paletteType in originPalettes.keys) {
            for (colorKey in originPalettes[paletteType]!!) {
                try {
                    targetPalettes[paletteType]!!.add(getColor(colorKey))
                } catch (ex: Exception) {
                    Log.w("DynamicColorModule", "there was an error getting color for $colorKey from $paletteType", ex)
                }
            }
        }

        val palettesArgument = Arguments.createMap()

        targetPalettes.forEach { entry ->
            val colorPalettesArgument = Arguments.createArray()
            entry.value.forEach {
                colorPalettesArgument.pushString(it)
            }
            palettesArgument.putArray(entry.key, colorPalettesArgument)
        }
        palettesArgument.putString("baseColor", getColor(android.R.color.system_accent1_400))

        return palettesArgument
    }
}
