module.exports = function (context) {
    var podfileLocation = "platforms/ios/Podfile";
    var CocoaLumberJackTargetVersion = "3.4.1";
    var pureeforkedOrg = "cmfsotelo";
    var pureeforkedTag = "2.0.1.OS6-tst";
    var fs = require("fs");

    return new Promise((resolve, reject) => {
        fs.readFile(podfileLocation, "utf8", function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Replacing CocoaLumberJack version to " + CocoaLumberJackTargetVersion + "");

            var result = data.replace(
                new RegExp("pod 'CocoaLumberjack', '[0-9.]+'"),
                "pod 'CocoaLumberjack', '" + CocoaLumberJackTargetVersion + "'"
            );

            console.log("Replacing PureeOS to alternative fork");

            var result = result.replace(
                new RegExp("pod 'PureeOS'.+"),
                "pod 'PureeOS', :tag => '" +
                    pureeforkedTag +
                    "', :git => 'https://github.com/" +
                    pureeforkedOrg +
                    "/puree-ios.git'"
            );
            fs.writeFile(podfileLocation, result, "utf8", function (err) {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log("Running pod install to update pods");
                var child_process = require("child_process");
                child_process.exec("pod install --verbose", { cwd: "platforms/ios" }, function (error) {
                    if (error !== null) {
                        console.log("exec error: " + error);
                        reject("pod installation failed" + error);
                    } else {
                        resolve();
                    }
                });
            });
        });
    });
};
