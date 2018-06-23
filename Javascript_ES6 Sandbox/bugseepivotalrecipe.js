console.log("");
//define input


var input = {
    integration: {
        provider: 'github'   // provider name that current recipe is executed for
    },
    issue: {
        key: 'IOS-123', // Unique key of the issue,
        summary: 'Something does not work', // Short summary of the issue
        description: '', // Description of the issue,
        created_on: '2017-01-19 23:29:32.021Z', // Date of creation
        type: 'bug', // Type of the issue, 'bug', 'crash' or 'error'
        state: 'open', // Issue state. Either 'open' or 'closed'
        labels: [], // String labels assigned to the issue
        url: 'https://app.bugsee.com/IOS/IOS-123', // URL of the issue
        priority: 5, // Automatically guessed priority for the current remote service provider (JIRA, GitHub, etc.)
        severity: 5, // Original Bugsee severity (1 through 5)
        reporter: 'John Smith (john.smith@example.com)', // User who reported an issue
        attributes: {
            // Session/user attributes
        }
    },
    app: {
        name: 'My Awesome App', // Application name
        version: '1.0.2',
        build: '12345'
    },
    device: {
        name: 'My precious',
        manufacturer: 'Samsung',
        model: 'GT-1656',
        model_name: 'Samsung Galaxy S6',
        screen: {
            width: 1440,
            height: 2560,
            scale: 1,
            dpiX: 577,
            dpiY: 577
        }
    },
    platform: {
        type: 'android', // Type: 'ios', 'android'
        version: '7.2.3', // OS version
        build: 'BG1234', // OS build
        release: 'Nougat' // Release name
    },
    // exists for manually pushed issues
    submitter: {
        name: 'John Doe',
        email: 'name@example.com'
    },
    // for issues reported by chrome extension
    browser: {
        type: 'Chrome',
        version: '66.0.3359.139'
    }
};


//define function
function create(context) {
  //(context) - input
    const issue = context.issue;
    const platform = context.platform;
    const device = context.device;
    const app = context.app;
    let summary;
    let description = issue.description;
    let labels = `[android, dev]`;

    if (issue.type == 'crash') {
        summary = `CRASH: ${issue.summary || 'No summary'} [${device.model_name}, ${platform.type}, ${platform.version}]`;
    }
    
    if (issue.type == 'bug') {
        summary = `USER BUG: ${issue.summary || 'No summary'} [${device.model_name}, ${platform.type}, ${platform.version}]`;
    
    }

    if (issue.reporter) {
        description += `Reported by ${issue.reporter || `Anonymous`}\n`;
    }
    
   
    description += `Device: ${device.manufacturer} ${device.model}\n`;
    description += `OS: ${platform.version}, ${platform.build}\n\n`;
    description += `View full Bugsee session at: ${issue.url}`;
    description += `Reproduction Steps:`\n\n` 1.\n` 2.\n` 3.\n` 4.\n` 5.\n`;    
  
//logic ends here
  
    return {
        summary: summary,
        description: description,
        labels: labels
    };
  
  //end of output
}

function update(context, changes) {
    const issue = context.issue;
    const platform = context.platform;
    const device = context.device;
    const app = context.app;
    const result = {};

    if (changes.description) {
        let description = changes.description.to || '';

        if (description) {
            // Add two newlines to separate other data from the description
            description += '\n\n';
        }

        if (issue.reporter) {
            description += `Reported by ${issue.reporter}\n`;
        }

        description += `View full Bugsee session at: ${issue.url}`;
        result.description = description;
    }

    if (changes.summary) {
        result.summary = `${issue.key}: ${changes.summary.to || 'No summary'} [Bugsee]`;
    }

    if (changes.state) {
        // Override state with a specific value, otherwise it will be mapped
        // automatically from Bugsee issue state ('open', 'closed')
        // result.state = 'completed';
    }

    return {
        issue: {
            custom: {
                // Optional
            }
        },
        changes: result
    };
}

//run by passing input into function

var output = create(input)

//print output

console.log(output)