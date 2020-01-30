const styleDictionary = require('style-dictionary');
const fs = require('fs');
const _ = require('lodash');

const getConfig = brand => {
    return {
        "source": [
            `src/brands/${brand}/*.json`,
            "src/components/**/*.json",
        ],
        "platforms": {
            "web/js": {
                "transformGroup": "tokens-js",
                "buildPath": `dist/web/${brand}/`,
                "prefix": "token",
                "files": [
                    {
                        "destination": "tokens.es6.js",
                        "format": "javascript/es6"
                    }
                ]
            },
            // there are different possible formats for iOS (JSON, PLIST, etc.) so you will have to agree with the iOS devs which format they prefer
            "ios": {
                // I have used custom formats for iOS but keep in mind that Style Dictionary offers some default formats/templates for iOS,
                // so have a look at the documentation before creating custom templates/formats, maybe they already work for you :)
                "transformGroup": "tokens-ios",
                "buildPath": `dist/ios/${brand}/`,
                "prefix": "token",
                "files": [
                    {
                        "destination": "tokens-all.plist",
                        "format": "ios/plist"
                    },
                    {
                        "destination": "tokens-colors.plist",
                        "format": "ios/plist",
                        "filter": {
                            "category": "color"
                        }
                    }
                ]
            },
            "android": {
                // I have used custom formats for Android but keep in mind that Style Dictionary offers some default formats/templates for Android,
                // so have a look at the documentation before creating custom templates/formats, maybe they already work for you :)
                "transformGroup": "tokens-android",
                "buildPath": `dist/android/${brand}/`,
                "prefix": "token",
                "files": [
                    {
                        "destination": "tokens-all.xml",
                        "format": "android/xml"
                    },
                    {
                        "destination": "tokens-colors.xml",
                        "format": "android/xml",
                        "filter": {
                            "category": "color"
                        }
                    }
                ]
            }
        }
    };
}

const iosTemplate = _.template(fs.readFileSync('templates/ios-plist.template'));
const androidTemplate = _.template(fs.readFileSync('templates/android-xml.template'));

styleDictionary.registerFormat({
    name: 'ios/plist',
    formatter: iosTemplate

});

styleDictionary.registerFormat({
    name: 'android/xml',
    formatter: androidTemplate

});

styleDictionary.registerFormat({
    name: 'android/colors',
    formatter: androidTemplate
});

styleDictionary.registerTransformGroup({
    name: 'tokens-js',
    transforms: ["name/cti/constant", "size/px", "color/hex"]
});

styleDictionary.registerTransformGroup({
    name: 'tokens-ios',
    transforms: ["attribute/cti", "name/cti/camel"]
});

styleDictionary.registerTransformGroup({
    name: 'tokens-android',
    transforms: ["attribute/cti", "name/cti/camel", "size/dp"]
});


console.log('Build started...');

['brand1', "brand2"].map((brand) => {
    ['web', 'ios', 'android'].map((platform) => {

        console.log('\n==============================================');
        console.log(`\nProcessing: [${brand}] [${platform}]`);

        const StyleDictionary = styleDictionary.extend(getConfig(brand));


        if (platform === 'web') {
            StyleDictionary.buildPlatform('web/js');
        } else if (platform === 'ios') {
            StyleDictionary.buildPlatform('ios');
        } else if (platform === 'android') {
            StyleDictionary.buildPlatform('android');
        }
        console.log('\nEnd processing');

    })
});

console.log('\n==============================================');
console.log('\nBuild completed!');