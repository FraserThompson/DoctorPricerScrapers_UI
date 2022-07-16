import config from "config";

export function getSessionToken() {
  return sessionStorage.getItem("dpSessionToken")
}

export async function login(username, password) {
  const response = await fetch(config.apiUrl + "/dp/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    console.error("Couldn't login: " + await response.text());
    return null;
  }

  const data = await response.json();

  return data;
  
}

export async function getPractices(params) {
  const paramString = params ? Object.entries(params).map(([key, val]) => key + "=" + val).join("&") : ""
  const response = await fetch(config.apiUrl + "/dp/api/practices/?" + paramString);

  if (!response.ok) {
    console.error("Couldn't get Practices: " + await response.text());
    return null;
  }

  const data = await response.json();
  return data;
}


export async function getAverages() {
  const response = await fetch(config.apiUrl + "/dp/averages/");

  if (!response.ok) {
    console.error("Couldn't get averages: " + await response.text());
    return null;
  }

  const data = await response.json();

  if (data[0].price__avg == null) {
    console.error("No averages: " + data);
  } else {
    return data;
  }
}

export async function getPHOPriceHistory(name) {
  const response = await fetch(config.apiUrl + "/dp/history/pho/?name=" + name);

  if (!response.ok) {
    console.error("Couldn't get averages: " + await response.text());
    return null;
  }

  const data = await response.json();
  return data;
}

export async function getPriceHistory() {
  const response = await fetch(config.apiUrl + "/dp/history");

  if (!response.ok) {
    console.error("Couldn't get averages: " + await response.text());
    return null;
  }

  const data = await response.json();
  return data;
}

export async function getPHOAverages(name) {
  const response = await fetch(config.apiUrl + "/dp/averages/pho/?name=" + name);
  const data = await response.json();

  if (!response.ok) {
    console.error("Couldn't get averages: " + await response.text());
    return null;
  }

  if (data[0].price__avg == null) {
    console.error("No averages: " + data);
  } else {
    return data;
  }
}

export async function getRegions(params) {
  const paramString = params ? Object.entries(params).map(([key, val]) => key + "=" + val).join("&") : ""
  const response = await fetch(config.apiUrl + "/dp/api/region/?" + paramString);

  if (!response.ok) {
    console.error(response);
    return null;
  }

  const data = await response.json();
  return data;
}

export async function getPhoList() {
  const response = await fetch(config.apiUrl + "/dp/api/pho/");

  if (!response.ok) {
    console.error(response);
    return null;
  }

  const data = await response.json();
  return data;
}

export async function getLogsList(name) {
  const response = await fetch(config.apiUrl + "/dp/api/logs/?source=" + name);

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data = await response.json();
  return data;
}

export async function clean(params) {
  const stringParams = params.reduce((acc, param) => {
    return acc + param + "=yes&"
  }, "?")
  const response = await fetch(config.apiUrl + "/dp/clean/" + stringParams, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getSessionToken(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text()
    console.error(errorText);
    return { data: null, error: errorText };
  }

  const data = await response.json();

  return { data: data, error: null };
}

export async function stopScraping(task_id, module) {
  const response = await fetch(
    config.apiUrl + "/dp/task_status?task_id=" + task_id + "&module=" + module,
    {
      method: "DELETE",
      headers: {
        Authorization: "Token " + getSessionToken(),
      },
    }
  );

  if (!response.ok) {
    console.error(await response.text());
    return null;
  }

  const data = await response.json();
  return data;
}

export async function startScraping(module) {
  const response = await fetch(config.apiUrl + "/dp/scrape/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getSessionToken(),
    },
    body: JSON.stringify({ module }),
  });

  if (!response.ok) {
    const errorText = await response.text()
    console.error(errorText);
    return { data: null, error: errorText };
  }

  const data = await response.json();

  return { data: data, error: null };
}

export async function submitData(module) {
  const response = await fetch(config.apiUrl + "/dp/submit/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + getSessionToken(),
    },
    body: JSON.stringify({ module: module }),
  });

  if (!response.ok) {
    const errorText = await response.text()
    console.error(errorText);
    return { data: null, error: errorText };
  }

  const data = await response.json();

  return { data: data, error: null };
}

export async function checkTask(task_id) {
  const response = await fetch(
    config.apiUrl + "/dp/task_status/?task_id=" + task_id
  );

  if (!response.ok) {
    const errorText = await response.text()
    console.error(errorText);
    return { data: null, error: await errorText };
  }

  const data = await response.json();

  return { data: data, error: null };
}
