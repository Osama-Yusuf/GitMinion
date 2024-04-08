Token="<Personal Access Token>"
Group="ksa22"
Project="card"
ENV="PROD"
Branch="prod"

group_id=$(curl "https://gitlab.com/api/v4/groups?search=${Group}" --header "PRIVATE-TOKEN: ${Token}" | jq -r '.[0].id')
project_id=$(curl "https://gitlab.com/api/v4/groups/${group_id}/projects?search=${Project}" --header "PRIVATE-TOKEN: ${Token}" | jq -r '.[0].id')
project_token=$(curl --header "PRIVATE-TOKEN: ${Token}" "https://gitlab.com/api/v4/projects/${project_id}/triggers" | jq -r '.[0].token')

curl --request POST --form "variables[ENV]=${ENV}" "https://gitlab.com/api/v4/projects/${project_id}/trigger/pipeline?token=${project_token}&ref=${Branch}"

# https://docs.gitlab.com/ee/api/pipeline_triggers.html

# -------------------------

# curl --header "PRIVATE-TOKEN: <Personal Access Token>" "https://gitlab.com/api/v4/groups/85253969"

# gitlab_url=https://gitlab.com
# access_token=<Personal Access Token>
# group_name=ksa22

# curl -s -H "Authorization: Bearer $access_token" \
#      -H "Content-Type:application/json" \
#      -d '{ 
#           "query": "{ group(fullPath: \"'$group_name'\") { projects {nodes { name description httpUrlToRepo nameWithNamespace starCount}}}}"
#       }' "https://$gitlab_url/api/graphql" | jq '.'


# curl --header "PRIVATE-TOKEN: <Personal Access Token>" https://gitlab.com/api/v4/groups/85253969/projects?&per_page=100

# -------------------------

# gitlab_url=https://gitlab.com
# access_token=<Personal Access Token>
# group_name=ksa22

# curl -s -H "Authorization: Bearer $access_token" \
#      -H "Content-Type:application/json" \
#      -d '{ 
#           "query": "{ group(fullPath: \"'$group_name'\") { projects {nodes { name description httpUrlToRepo nameWithNamespace starCount}}}}"
#       }' "https://$gitlab_url/api/graphql" | jq '.'

# -------------------------

# curl --request POST "https://gitlab.com/api/v4/projects/56580040/trigger/pipeline?token=<pipeline trigger token>&ref=main"
