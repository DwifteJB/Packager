git add .
echo "Update reason:"
read reason
git commit -m "$reason"
git push
